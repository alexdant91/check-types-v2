"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Schema = _interopRequireDefault(require("./Schema"));

var _SetTypes2 = _interopRequireDefault(require("./SetTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _init = new WeakMap();

var CheckTypes = /*#__PURE__*/function (_SetTypes) {
  _inherits(CheckTypes, _SetTypes);

  var _super = _createSuper(CheckTypes);

  function CheckTypes(_value) {
    var _thisSuper, _thisSuper2, _thisSuper3, _thisSuper4, _thisSuper5, _thisSuper6, _this;

    _classCallCheck(this, CheckTypes);

    _this = _super.call(this);

    _init.set(_assertThisInitialized(_this), {
      writable: true,
      value: function value() {
        _this.initSetTypes();

        _this.value = null;
        _this.schema = false;
        _this.errors = [];
        return _assertThisInitialized(_this);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setValue", function (value) {
      _classPrivateFieldGet(_assertThisInitialized(_this), _init).call(_assertThisInitialized(_this));

      _this.value = value;
      return _assertThisInitialized(_this);
    });

    _defineProperty(_assertThisInitialized(_this), "setSchema", function (schema) {
      if (!(schema instanceof _Schema["default"])) throw new Error("Schema must be a valid instance of Schema class.");
      _this.schema = schema;
      return _assertThisInitialized(_this);
    });

    _defineProperty(_assertThisInitialized(_this), "check", function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        strict: true,
        extended: false
      };

      // If schema is settled return an error
      if (_this.schema) {
        // Schema is settled so proceed
        var checkedValue = {};
        var specifiedFields = Object.keys(_this.schema.schema);
        return _this.checkSchema(_this.value, _this.schema, specifiedFields, checkedValue, options);
      } else {
        // If not schema settled check value type
        var isAny = _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(CheckTypes.prototype)), "isAny", _thisSuper);

        var isRequired = _get((_thisSuper2 = _assertThisInitialized(_this), _getPrototypeOf(CheckTypes.prototype)), "isRequired", _thisSuper2);

        var isDefault = _get((_thisSuper3 = _assertThisInitialized(_this), _getPrototypeOf(CheckTypes.prototype)), "isDefault", _thisSuper3);

        var isEnum = _get((_thisSuper4 = _assertThisInitialized(_this), _getPrototypeOf(CheckTypes.prototype)), "isEnum", _thisSuper4);

        var isArray = Array.isArray(_this.value);

        var typeofValue = _this.checkType(_this.value);

        if (isEnum) {
          if (isDefault) _this.value = isDefault;

          if (Array.isArray(_this.value)) {
            // Check is array of the new value id settled
            _this.value.forEach(function (val) {
              if (isEnum.indexOf(val) === -1) {
                _this.errors.push("Value must be one of [\"".concat(isEnum.join('", "'), "\"]."));

                if (!options.extended) return false;else return {
                  errors: "Value must be one of [".concat(isEnum.join(', '), "]."),
                  value: false
                };
              }

              ;
            });
          } else {
            if (isEnum.indexOf(_this.value) === -1) {
              _this.errors.push("Value must be one of [".concat(isEnum.join(', '), "]."));

              if (!options.extended) return false;else return {
                errors: "Value must be one of [\"".concat(isEnum.join('", "'), "\"]."),
                value: false
              };
            }

            ;
          }
        }

        if (isAny) {
          if (isRequired && !isDefault && _this.value != "" && _this.value != undefined && _this.value != null) return _this.value;else if (isRequired && isDefault && (_this.value == "" || _this.value == undefined || _this.value == null)) return isDefault;else if (!isRequired) return _this.value;else if (_this.value != "" && _this.value != undefined && _this.value != null) return _this.value;else {
            if (!options.extended) return false;else return {
              errors: _this.errors,
              value: false
            };
          }
        } else if (isArray) {
          if (typeofValue === 'array_of') {
            return _this.checkArrayOf(_this.value, options);
          } else {
            if (_get((_thisSuper5 = _assertThisInitialized(_this), _getPrototypeOf(CheckTypes.prototype)), "types", _thisSuper5).indexOf('array') !== -1) return _this.value;else return false;
          }
        } else {
          if (isRequired && !isDefault && _this.value != "" && _this.value != undefined && _this.value != null) return _this.value;else if (isRequired && isDefault && (_this.value == "" || _this.value == undefined || _this.value == null)) return isDefault;else {
            if (_get((_thisSuper6 = _assertThisInitialized(_this), _getPrototypeOf(CheckTypes.prototype)), "types", _thisSuper6).indexOf(typeofValue) !== -1) return _this.value;else {
              if (!options.extended) return false;else return {
                errors: _this.errors,
                value: _this.value
              };
            }
          }
        }
      }
    });

    _this.value = _value || null;
    _this.schema = false;
    _this.errors = [];
    return _this;
  }

  return CheckTypes;
}(_SetTypes2["default"]);

exports["default"] = CheckTypes;