"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertValidString = assertValidString;
exports.assertIsOfType = assertIsOfType;
exports.assertValidOperation = assertValidOperation;
exports.assertIsOfTypeOrNull = exports.assertValidStringOrNull = void 0;

var _lodash = require("lodash");

function _orNullDecorator(fn) {
  return function (arg) {
    if ((0, _lodash.isNil)(arg)) return;

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return fn.apply(void 0, [arg].concat(rest));
  };
}

function assertValidString(str, name) {
  var trimmed = (0, _lodash.trim)(str);

  if (trimmed === '') {
    throw new Error("".concat(name, " should not be empty"));
  }
}

var assertValidStringOrNull = _orNullDecorator(assertValidString);

exports.assertValidStringOrNull = assertValidStringOrNull;

function assertIsOfType(obj, type) {
  if (!(obj instanceof type)) {
    throw new Error("".concat(obj, " is not an instance of ").concat(type));
  }
}

var assertIsOfTypeOrNull = _orNullDecorator(assertIsOfType);

exports.assertIsOfTypeOrNull = assertIsOfTypeOrNull;

function assertValidOperation(operation) {
  if (['query', 'mutation', 'subscription'].indexOf(operation) === -1) {
    throw new Error("".concat(operation, " is not a valid operation (query, mutation or subscription)"));
  }
}