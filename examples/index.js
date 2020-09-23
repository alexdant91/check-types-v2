const { Types, CheckTypes, Schema } = require('../lib');

const { String, Array, Number, Boolean, Float } = new Types();
const CheckType = new CheckTypes();

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
  },
  floatNumber: {
    type: Float,
    required: true,
    default: 1.5
  }
});

const value1 = CheckType.setValue().Any().Required().Default('test').Enum(['test']).check({ extended: true });
const value2 = CheckType.setValue([1, 'test', true]).String().Array({ of: [String, Number, Boolean] }).check({ extended: true });

const obj = {
  firstname: "alexdant91@gmail.com",
  username: 'test1',
  emails: ["alexdant91@gmail.com"],
  roles: ['ADMIN'],
  role: 'USER',
  floatNumber: 5.3
};
const value3 = CheckType.setValue(obj).setSchema(customSchema).check({ strict: false, extended: true });

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
