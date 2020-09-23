const { Types, Schema } = require('../../lib');

const { String, Array, Float } = new Types();

module.exports.customSchema = new Schema({
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
