# check-types-v2

New version of check types library. Check on [npm](https://www.npmjs.com/package/check-types-v2).

## Install

```cmd
npm install check-types-v2 --save
yarn add check-types-v2
```

## Example

Following a generic example, full documentation is under construction.

```js
const { Types, CheckTypes, Schema } = require('check-types-v2');
// Get data types helpers
const { String, Array, Number, Boolean } = new Types();
// Call a new instance of CheckTypes only once.
const CheckType = new CheckTypes();

// Set a custom schema to validate data
const customSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    default: null,
    match: /[A-z]/ig
  },
  roles: {
    type: Array,
    of: [String],
    required: true,
    enum: ['GUEST', 'USER', 'ADMIN'],
    default: ['ADMIN']
  },
  role: {
    type: String,
    required: true,
    enum: ['GUEST', 'USER', 'ADMIN'],
    default: 'ADMIN'
  },
  emails: {
    type: Array,
    of: String,
    required: true,
    default: [],
    match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ig
  }
});

// Some custom features example
const value1 = CheckType.setValue().Any().Required().Default('test').Enum(['test']).check({ extended: true });
// Array and nested array example
const value2 = CheckType.setValue([1, 'test', true]).String().Array({ of: [String, Number, Boolean] }).check({ extended: true });

// Fake request body
const obj = {
  firstname: "alexdant91@gmail.com",
  username: 'test1',
  emails: ["alexdant91@gmail.com"],
  roles: ['ADMIN'],
  role: 'USER'
};
// Use schema to validate
const value3 = CheckType.setValue(obj).setSchema(customSchema).check({ strict: false, extended: true });

// Outputs
console.log(value1); // Will output: test
console.log(value2); // Will output: [ 1, 'test', true ]

console.log(value3);
/**
 * Will output:
 * {
 *   firstname: 'alexdant91@gmail.com',
 *   username: 'test1',
 *   emails: [ 'alexdant91@gmail.com' ],
 *   roles: [ 'ADMIN' ],
 *   role: 'USER'
 * }
 */

```

## To do

This project is under active maintenance. New features soon.

### To fix and improvements

* [ ] Fix errors handler, it takes the same error multiple times
* [ ] Integrate `Float` and `Int` validation type

### Generic

* [ ] Write complete documentation
* [ ] Write example for each function
