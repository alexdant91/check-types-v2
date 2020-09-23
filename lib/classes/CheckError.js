"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CheckError = function CheckError(key, type, replace) {
  var _this = this;

  _classCallCheck(this, CheckError);

  _defineProperty(this, "buildError", function () {
    var message = _this.messages[_this.type] != undefined ? _this.messages[_this.type] : 'Unknown Error.';
    if (_this.isReplace && !_this.isReplaceArray) message = message.replace('%str%', _this.replace);
    if (_this.isReplace && _this.isReplaceArray) message = message.replace('%str%', _this.replace.join('", "'));
    return {
      key: _this.key,
      type: _this.messages[_this.type] != undefined ? _this.type : 'unknown_error',
      message: message
    };
  });

  this.messages = {
    'required': 'Field is required.',
    'type_error': 'Data type check error.',
    'not_match': 'Must match %str% pattern.',
    'not_enum': 'Value must be one of ["%str%"].'
  };
  this.key = key;
  this.type = type;
  this.replace = replace || null;
  this.isReplace = this.replace == null;
  this.isReplaceArray = Array.isArray(this.replace);
  return this.buildError();
};

var _default = CheckError;
exports["default"] = _default;