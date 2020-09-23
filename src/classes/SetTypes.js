/**
 * MIT License
 *
 * Copyright (c) 2020 Alessandro D'Antoni
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Types from './Types';
import CheckError from './CheckError';

export default class SetTypes {
  constructor() {
    this.ierrors = [];
    this.arrayOf = false;
    SetTypes.prototype.isAny = false;
    SetTypes.prototype.isRequired = false;
    SetTypes.prototype.isDefault = false;
    SetTypes.prototype.isEnum = false;
    SetTypes.prototype.valueType = false;
    SetTypes.prototype.types = [];
  }

  initSetTypes = () => {
    this.ierrors = [];
    this.arrayOf = false;
    SetTypes.prototype.isAny = false;
    SetTypes.prototype.isRequired = false;
    SetTypes.prototype.isDefault = false;
    SetTypes.prototype.isEnum = false;
    SetTypes.prototype.valueType = false;
    SetTypes.prototype.types = [];
  }

  checkType = (value) => {
    if (Array.isArray(value) && !this.arrayOf) {
      SetTypes.prototype.valueType = 'array';
      return 'array';
    } else if (Array.isArray(value) && this.arrayOf) {
      SetTypes.prototype.valueType = 'array_of';
      return 'array_of';
    } else {
      SetTypes.prototype.valueType = typeof value;
      return typeof value;
    }
  }

  checkArrayOf = (value, options = { extended: false, arrayOfType: null }) => {
    const arrayOfType = options.arrayOfType == null ? this.types.find(type => Array.isArray(type) && type[0] == 'array_of') : options.arrayOfType;
    const _arrayOfType = Array.isArray(arrayOfType[1]) ? arrayOfType[1] : [arrayOfType[1]];
    if (_arrayOfType.indexOf('any') === -1) {
      value.forEach(val => {
        if (_arrayOfType.indexOf(typeof val) === -1) this.ierrors.push(`Must be an array of ${_arrayOfType.join(' or ')}, found ${typeof val} type in array.`);
      });
      if (this.ierrors.length !== 0 && options.extended) return { errors: this.ierrors[0], value };
      else if (this.ierrors.length === 0) return value;
      else return false;
    } else {
      return value;
    }
  }

  checkIsInteger = (value) => {
    if (typeof value !== "number") return false;
    return value % 1 === 0;
  }

  checkIsFloat = (value) => {
    if (typeof value !== "number") return false;
    return value === value && value % 1 !== 0;
  }

  checkSchema = (topValue, schema, specifiedFields, checkedValue, options) => {
    // Check value inserted
    Object.keys(topValue).forEach(key => {
      const value = topValue[key];
      const isArray = Array.isArray(value);
      if (specifiedFields.indexOf(key) !== -1) {
        const check = schema.schema[key];
        if (Array.isArray(check.type)) {
          // Array of value types
          if (check.type.indexOf("any") === -1) {
            // if (check.required && !check.default && value != "" && value != null && value != undefined) this.ierrors.push({ key, type: 'required_from_array' });
            if (check.required && check.default != undefined && (value == "" || value == null || value == undefined)) checkedValue[key] = check.default;
            else if (check.required && check.default == undefined && (value == "" || value == null || value == undefined)) this.ierrors.push(new CheckError(key, 'required'));
            if (check.type.indexOf("array") !== -1 && !isArray) this.ierrors.push({ key, type: 'not_array' });

            if (check.type.indexOf("array") === -1 && check.type.indexOf("int") !== -1 && check.type.indexOf("float") !== -1 && check.type.indexOf(typeof value) === -1) this.ierrors.push(new CheckError(key, 'type_error'));

            // ***************
            if (check.type.indexOf("array") === -1 && check.type.indexOf("int") !== -1 && !this.checkIsInteger(value)) this.ierrors.push(new CheckError(key, 'type_error'));
            if (check.type.indexOf("array") === -1 && check.type.indexOf("float") !== -1 && !this.checkIsFloat(value)) this.ierrors.push(new CheckError(key, 'type_error'));
            // ***************

            if (check.of && isArray) {
              const checkArrayOf = this.checkArrayOf(value, { extended: true, arrayOfType: ['array_of', check.of] });
              if (checkArrayOf.errors) this.ierrors.push({ key, type: 'type_error', message: checkArrayOf.errors });
            }
            if (check.match) {
              // All array item must respect regexp pattern
              value.forEach(val => { if (!String(val).match(check.match)) this.ierrors.push(new CheckError(key, 'not_match', check.match.toString())); });
            }
            if (check.enum && Array.isArray(check.enum)) {
              if (isArray) {
                value.forEach(val => {
                  if (check.enum.indexOf(val) === -1) this.ierrors.push(new CheckError(key, 'not_enum', check.enum));
                });
              } else {
                if (check.enum.indexOf(value) === -1) this.ierrors.push(new CheckError(key, 'not_enum', check.enum));
              }
            } else if (check.enum && !Array.isArray(check.enum)) {
              throw new Error("TypeError: enum must be an array of values.");
            }
            if (check.default && (value == "" || value == null || value == undefined)) checkedValue[key] = check.default;
            else checkedValue[key] = value;
          } else {
            checkedValue[key] = value;
          }
        } else {
          // Not array of value types
          if (check.type !== "any") {
            if (check.required && check.default != undefined && (value == "" || value == null || value == undefined)) checkedValue[key] = check.default;
            else if (check.required && check.default == undefined && (value == "" || value == null || value == undefined)) this.ierrors.push({ key, type: 'required', message: 'Field is required.' });
            if (check.type === "array" && !isArray) this.ierrors.push({ key, type: 'not_array', message: 'Field must be a valid Array.' });
            if (check.type !== "array" && check.type !== "int" && check.type !== "float" && typeof value !== check.type) this.ierrors.push(new CheckError(key, 'type_error'));

            // ***************
            if (check.type !== "array" && check.type == "int" && !this.checkIsInteger(value)) this.ierrors.push(new CheckError(key, 'type_error'));
            if (check.type !== "array" && check.type == "float" && !this.checkIsFloat(value)) this.ierrors.push(new CheckError(key, 'type_error'));
            // ***************

            if (check.of) {
              const checkArrayOf = this.checkArrayOf(value, { extended: true, arrayOfType: ['array_of', check.of] });
              // ***************
              if (check.type !== "array" && check.type == "int" && !this.checkIsInteger(value)) this.ierrors.push(new CheckError(key, 'type_error'));
              if (check.type !== "array" && check.type == "float" && !this.checkIsFloat(value)) this.ierrors.push(new CheckError(key, 'type_error'));
              // ***************
              if (checkArrayOf.errors) this.ierrors.push({ key, type: 'type_error', message: checkArrayOf.errors });
            }
            if (check.enum && Array.isArray(check.enum)) {
              if (isArray) {
                value.forEach(val => {
                  if (check.enum.indexOf(val) === -1) this.ierrors.push(new CheckError(key, 'not_enum', check.enum));
                });
              } else {
                if (check.enum.indexOf(value) === -1) this.ierrors.push(new CheckError(key, 'not_enum', check.enum));
              }
            } else if (check.enum && !Array.isArray(check.enum)) {
              throw new Error("TypeError: enum must be an array of values.");
            }
            if (check.match && !String(value).match(check.match)) this.ierrors.push(new CheckError(key, 'not_match', check.match.toString()));
            if (check.default && (value == "" || value == null || value == undefined)) checkedValue[key] = check.default;
            else checkedValue[key] = value;
          } else {
            checkedValue[key] = value;
          }
        }
      } else {
        if (!options.strict) checkedValue[key] = value;
      }
    });
    // Then check schema
    Object.keys(schema.schema).forEach(key => {
      const check = schema.schema[key];
      const insertedValue = checkedValue[key];
      if (!insertedValue && check.required && !check.default) this.ierrors.push({ key, type: 'required', message: 'Field is required.' });
      if (!insertedValue && check.default) checkedValue[key] = check.default;
    });
    if (this.ierrors.length !== 0 && options.extended) return { errors: this.ierrors, value: topValue };
    else if (this.ierrors.length === 0) return checkedValue;
    else return false;
  }

  Required = () => {
    SetTypes.prototype.isRequired = true;
    return this;
  }

  Default = (defaultValue) => {
    SetTypes.prototype.isDefault = defaultValue;
    return this;
  }

  Enum = (enumArray) => {
    if (enumArray && Array.isArray(enumArray)) SetTypes.prototype.isEnum = enumArray;
    else if (enumArray && !Array.isArray(enumArray)) throw new Error("TypeError: enum must be an array of values.");
    else throw new Error("TypeError: enum array must be provided.");
    return this;
  }

  Any = () => {
    SetTypes.prototype.isAny = true;
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'any'];
    return this;
  }

  // TODO: Implement class detection system
  Class = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'class'];
    return this;
  }

  String = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'string'];
    return this;
  }

  Array = (options = { of: false }) => {
    if (options.of) {
      if (!options.of instanceof Types) throw new Error("Array of must be a valid instance of Type class.");
      this.arrayOf = true;
      const optionsArrayOf = Array.isArray(options.of) ? options.of : [options.of];
      SetTypes.prototype.types = [...SetTypes.prototype.types, ['array_of', optionsArrayOf]];
    } else {
      SetTypes.prototype.types = [...SetTypes.prototype.types, 'array'];
    }
    return this;
  }

  Object = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'object'];
    return this;
  }

  Boolean = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'boolean'];
    return this;
  }

  Function = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'function'];
    return this;
  }

  Number = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'number'];
    return this;
  }

  BigInt = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'bigint'];
    return this;
  }

  Int = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'int'];
    return this;
  }

  Float = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'float'];
    return this;
  }

  Symbol = () => {
    SetTypes.prototype.types = [...SetTypes.prototype.types, 'symbol'];
    return this;
  }
}
