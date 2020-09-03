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

import Schema from './Schema';
import SetTypes from './SetTypes';

export default class CheckTypes extends SetTypes {
  constructor(value) {
    super();
    this.value = value || null;
    this.schema = false;
    this.errors = [];
  }

  #init = () => {
    this.initSetTypes();
    this.value = null;
    this.schema = false;
    this.errors = [];
    return this;
  }

  setValue = (value) => {
    this.#init();
    this.value = value;
    return this;
  }

  setSchema = (schema) => {
    if (!(schema instanceof Schema)) throw new Error("Schema must be a valid instance of Schema class.");
    this.schema = schema;
    return this;
  }

  check = (options = { strict: true, extended: false }) => {
    // If schema is settled return an error
    if (this.schema) {
      // Schema is settled so proceed
      const checkedValue = {};
      const specifiedFields = Object.keys(this.schema.schema);
      return this.checkSchema(this.value, this.schema, specifiedFields, checkedValue, options)
    } else {
      // If not schema settled check value type
      const isAny = super.isAny;
      const isRequired = super.isRequired;
      const isDefault = super.isDefault;
      const isEnum = super.isEnum;
      const isArray = Array.isArray(this.value);
      const typeofValue = this.checkType(this.value);
      if (isEnum) {
        if (isDefault) this.value = isDefault;
        if (Array.isArray(this.value)) { // Check is array of the new value id settled
          this.value.forEach(val => {
            if (isEnum.indexOf(val) === -1) {
              this.errors.push(`Value must be one of ["${isEnum.join('", "')}"].`)
              if (!options.extended) return false;
              else return { errors: `Value must be one of [${isEnum.join(', ')}].`, value: false };
            };
          });
        } else {
          if (isEnum.indexOf(this.value) === -1) {
            this.errors.push(`Value must be one of [${isEnum.join(', ')}].`)
            if (!options.extended) return false;
            else return { errors: `Value must be one of ["${isEnum.join('", "')}"].`, value: false };
          };
        }
      }
      if (isAny) {
        if (isRequired && !isDefault && this.value != "" && this.value != undefined && this.value != null) return this.value;
        else if (isRequired && isDefault && (this.value == "" || this.value == undefined || this.value == null)) return isDefault;
        else if (!isRequired) return this.value;
        else if (this.value != "" && this.value != undefined && this.value != null) return this.value;
        else {
          if (!options.extended) return false;
          else return { errors: this.errors, value: false };
        }
      } else if (isArray) {
        if (typeofValue === 'array_of') {
          return this.checkArrayOf(this.value, options);
        } else {
          if (super.types.indexOf('array') !== -1) return this.value;
          else return false;
        }
      } else {
        if (isRequired && !isDefault && this.value != "" && this.value != undefined && this.value != null) return this.value;
        else if (isRequired && isDefault && (this.value == "" || this.value == undefined || this.value == null)) return isDefault;
        else {
          if (super.types.indexOf(typeofValue) !== -1) return this.value;
          else {
            if (!options.extended) return false;
            else return { errors: this.errors, value: this.value };
          }
        }
      }
    }
  }
}
