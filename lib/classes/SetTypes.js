"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Types = _interopRequireDefault(require("./Types"));

var _CheckError = _interopRequireDefault(require("./CheckError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SetTypes = function SetTypes() {
  var _this = this;

  _classCallCheck(this, SetTypes);

  _defineProperty(this, "initSetTypes", function () {
    _this.ierrors = [];
    _this.arrayOf = false;
    SetTypes.prototype.isAny = false;
    SetTypes.prototype.isRequired = false;
    SetTypes.prototype.isDefault = false;
    SetTypes.prototype.isEnum = false;
    SetTypes.prototype.valueType = false;
    SetTypes.prototype.types = [];
  });

  _defineProperty(this, "checkType", function (value) {
    if (Array.isArray(value) && !_this.arrayOf) {
      SetTypes.prototype.valueType = 'array';
      return 'array';
    } else if (Array.isArray(value) && _this.arrayOf) {
      SetTypes.prototype.valueType = 'array_of';
      return 'array_of';
    } else {
      SetTypes.prototype.valueType = _typeof(value);
      return _typeof(value);
    }
  });

  _defineProperty(this, "checkArrayOf", function (value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      extended: false,
      arrayOfType: null
    };
    var arrayOfType = options.arrayOfType == null ? _this.types.find(function (type) {
      return Array.isArray(type) && type[0] == 'array_of';
    }) : options.arrayOfType;

    var _arrayOfType = Array.isArray(arrayOfType[1]) ? arrayOfType[1] : [arrayOfType[1]];

    if (_arrayOfType.indexOf('any') === -1) {
      value.forEach(function (val) {
        if (_arrayOfType.indexOf(_typeof(val)) === -1) _this.ierrors.push("Must be an array of ".concat(_arrayOfType.join(' or '), ", found ").concat(_typeof(val), " type in array."));
      });
      if (_this.ierrors.length !== 0 && options.extended) return {
        errors: _this.ierrors[0],
        value: value
      };else if (_this.ierrors.length === 0) return value;else return false;
    } else {
      return value;
    }
  });

  _defineProperty(this, "checkIsInteger", function (value) {
    if (typeof value !== "number") return false;
    return value % 1 === 0;
  });

  _defineProperty(this, "checkIsFloat", function (value) {
    if (typeof value !== "number") return false;
    return value === value && value % 1 !== 0;
  });

  _defineProperty(this, "checkSchema", function (topValue, schema, specifiedFields, checkedValue, options) {
    // Check value inserted
    Object.keys(topValue).forEach(function (key) {
      var value = topValue[key];
      var isArray = Array.isArray(value);

      if (specifiedFields.indexOf(key) !== -1) {
        var check = schema.schema[key];

        if (Array.isArray(check.type)) {
          // Array of value types
          if (check.type.indexOf("any") === -1) {
            // if (check.required && !check.default && value != "" && value != null && value != undefined) this.ierrors.push({ key, type: 'required_from_array' });
            if (check.required && check["default"] != undefined && (value == "" || value == null || value == undefined)) checkedValue[key] = check["default"];else if (check.required && check["default"] == undefined && (value == "" || value == null || value == undefined)) _this.ierrors.push(new _CheckError["default"](key, 'required'));
            if (check.type.indexOf("array") !== -1 && !isArray) _this.ierrors.push({
              key: key,
              type: 'not_array'
            });
            if (check.type.indexOf("array") === -1 && check.type.indexOf("int") !== -1 && check.type.indexOf("float") !== -1 && check.type.indexOf(_typeof(value)) === -1) _this.ierrors.push(new _CheckError["default"](key, 'type_error')); // ***************

            if (check.type.indexOf("array") === -1 && check.type.indexOf("int") !== -1 && !_this.checkIsInteger(value)) _this.ierrors.push(new _CheckError["default"](key, 'type_error'));
            if (check.type.indexOf("array") === -1 && check.type.indexOf("float") !== -1 && !_this.checkIsFloat(value)) _this.ierrors.push(new _CheckError["default"](key, 'type_error')); // ***************

            if (check.of && isArray) {
              var checkArrayOf = _this.checkArrayOf(value, {
                extended: true,
                arrayOfType: ['array_of', check.of]
              });

              if (checkArrayOf.errors) _this.ierrors.push({
                key: key,
                type: 'type_error',
                message: checkArrayOf.errors
              });
            }

            if (check.match) {
              // All array item must respect regexp pattern
              value.forEach(function (val) {
                if (!String(val).match(check.match)) _this.ierrors.push(new _CheckError["default"](key, 'not_match', check.match.toString()));
              });
            }

            if (check["enum"] && Array.isArray(check["enum"])) {
              if (isArray) {
                value.forEach(function (val) {
                  if (check["enum"].indexOf(val) === -1) _this.ierrors.push(new _CheckError["default"](key, 'not_enum', check["enum"]));
                });
              } else {
                if (check["enum"].indexOf(value) === -1) _this.ierrors.push(new _CheckError["default"](key, 'not_enum', check["enum"]));
              }
            } else if (check["enum"] && !Array.isArray(check["enum"])) {
              throw new Error("TypeError: enum must be an array of values.");
            }

            if (check["default"] && (value == "" || value == null || value == undefined)) checkedValue[key] = check["default"];else checkedValue[key] = value;
          } else {
            checkedValue[key] = value;
          }
        } else {
          // Not array of value types
          if (check.type !== "any") {
            if (check.required && check["default"] != undefined && (value == "" || value == null || value == undefined)) checkedValue[key] = check["default"];else if (check.required && check["default"] == undefined && (value == "" || value == null || value == undefined)) _this.ierrors.push({
              key: key,
              type: 'required',
              message: 'Field is required.'
            });
            if (check.type === "array" && !isArray) _this.ierrors.push({
              key: key,
              type: 'not_array',
              message: 'Field must be a valid Array.'
            });
            if (check.type !== "array" && check.type !== "int" && check.type !== "float" && _typeof(value) !== check.type) _this.ierrors.push(new _CheckError["default"](key, 'type_error')); // ***************

            if (check.type !== "array" && check.type == "int" && !_this.checkIsInteger(value)) _this.ierrors.push(new _CheckError["default"](key, 'type_error'));
            if (check.type !== "array" && check.type == "float" && !_this.checkIsFloat(value)) _this.ierrors.push(new _CheckError["default"](key, 'type_error')); // ***************

            if (check.of) {
              var _checkArrayOf = _this.checkArrayOf(value, {
                extended: true,
                arrayOfType: ['array_of', check.of]
              }); // ***************


              if (check.type !== "array" && check.type == "int" && !_this.checkIsInteger(value)) _this.ierrors.push(new _CheckError["default"](key, 'type_error'));
              if (check.type !== "array" && check.type == "float" && !_this.checkIsFloat(value)) _this.ierrors.push(new _CheckError["default"](key, 'type_error')); // ***************

              if (_checkArrayOf.errors) _this.ierrors.push({
                key: key,
                type: 'type_error',
                message: _checkArrayOf.errors
              });
            }

            if (check["enum"] && Array.isArray(check["enum"])) {
              if (isArray) {
                value.forEach(function (val) {
                  if (check["enum"].indexOf(val) === -1) _this.ierrors.push(new _CheckError["default"](key, 'not_enum', check["enum"]));
                });
              } else {
                if (check["enum"].indexOf(value) === -1) _this.ierrors.push(new _CheckError["default"](key, 'not_enum', check["enum"]));
              }
            } else if (check["enum"] && !Array.isArray(check["enum"])) {
              throw new Error("TypeError: enum must be an array of values.");
            }

            if (check.match && !String(value).match(check.match)) _this.ierrors.push(new _CheckError["default"](key, 'not_match', check.match.toString()));
            if (check["default"] && (value == "" || value == null || value == undefined)) checkedValue[key] = check["default"];else checkedValue[key] = value;
          } else {
            checkedValue[key] = value;
          }
        }
      } else {
        if (!options.strict) checkedValue[key] = value;
      }
    }); // Then check schema

    Object.keys(schema.schema).forEach(function (key) {
      var check = schema.schema[key];
      var insertedValue = checkedValue[key];
      if (!insertedValue && check.required && !check["default"]) _this.ierrors.push({
        key: key,
        type: 'required',
        message: 'Field is required.'
      });
      if (!insertedValue && check["default"]) checkedValue[key] = check["default"];
    });
    if (_this.ierrors.length !== 0 && options.extended) return {
      errors: _this.ierrors,
      value: topValue
    };else if (_this.ierrors.length === 0) return checkedValue;else return false;
  });

  _defineProperty(this, "Required", function () {
    SetTypes.prototype.isRequired = true;
    return _this;
  });

  _defineProperty(this, "Default", function (defaultValue) {
    SetTypes.prototype.isDefault = defaultValue;
    return _this;
  });

  _defineProperty(this, "Enum", function (enumArray) {
    if (enumArray && Array.isArray(enumArray)) SetTypes.prototype.isEnum = enumArray;else if (enumArray && !Array.isArray(enumArray)) throw new Error("TypeError: enum must be an array of values.");else throw new Error("TypeError: enum array must be provided.");
    return _this;
  });

  _defineProperty(this, "Any", function () {
    SetTypes.prototype.isAny = true;
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['any']);
    return _this;
  });

  _defineProperty(this, "Class", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['class']);
    return _this;
  });

  _defineProperty(this, "String", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['string']);
    return _this;
  });

  _defineProperty(this, "Array", function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      of: false
    };

    if (options.of) {
      if (!options.of instanceof _Types["default"]) throw new Error("Array of must be a valid instance of Type class.");
      _this.arrayOf = true;
      var optionsArrayOf = Array.isArray(options.of) ? options.of : [options.of];
      SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), [['array_of', optionsArrayOf]]);
    } else {
      SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['array']);
    }

    return _this;
  });

  _defineProperty(this, "Object", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['object']);
    return _this;
  });

  _defineProperty(this, "Boolean", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['boolean']);
    return _this;
  });

  _defineProperty(this, "Function", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['function']);
    return _this;
  });

  _defineProperty(this, "Number", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['number']);
    return _this;
  });

  _defineProperty(this, "BigInt", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['bigint']);
    return _this;
  });

  _defineProperty(this, "Int", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['int']);
    return _this;
  });

  _defineProperty(this, "Float", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['float']);
    return _this;
  });

  _defineProperty(this, "Symbol", function () {
    SetTypes.prototype.types = [].concat(_toConsumableArray(SetTypes.prototype.types), ['symbol']);
    return _this;
  });

  this.ierrors = [];
  this.arrayOf = false;
  SetTypes.prototype.isAny = false;
  SetTypes.prototype.isRequired = false;
  SetTypes.prototype.isDefault = false;
  SetTypes.prototype.isEnum = false;
  SetTypes.prototype.valueType = false;
  SetTypes.prototype.types = [];
};

exports["default"] = SetTypes;