"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsToGQLValue = jsToGQLValue;
exports.Document = exports.Subscription = exports.Mutation = exports.Query = exports.OperationDefinition = exports.SelectionSet = exports.Field = exports.ArgumentList = void 0;

var t = _interopRequireWildcard(require("graphql-ast-types"));

var _lodash = require("lodash");

var _validation = require("./validation");

var _language = require("graphql/language");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function jsToGQLValue(val) {
  if (t.isValue(val)) {
    return val;
  }

  if ((0, _lodash.isBoolean)(val)) {
    return t.booleanValue(val);
  }

  if ((0, _lodash.isNil)(val)) {
    return t.nullValue();
  }

  if ((0, _lodash.isString)(val)) {
    return t.stringValue(val);
  }

  if ((0, _lodash.isInteger)(val)) {
    return t.intValue(val + ''); // Ridiculous, but needed
  }

  if ((0, _lodash.isNumber)(val)) {
    return t.floatValue(val + ''); // Here too
  }

  if ((0, _lodash.isArray)(val)) {
    return t.listValue(val.map(function (v) {
      return jsToGQLValue(v);
    }));
  }

  if ((0, _lodash.isPlainObject)(val)) {
    return t.objectValue((0, _lodash.toPairs)(val).map(function (pair) {
      return t.objectField(t.name(pair[0]), jsToGQLValue(pair[1]));
    }));
  }

  throw new Error("Could not guess GraphQL type of value ".concat(val, ". Please use types from 'graphql-ast-types', as 't.enumValue()' for example"));
} // Builders


var ArgumentList =
/*#__PURE__*/
function () {
  function ArgumentList() {
    _classCallCheck(this, ArgumentList);

    this.args = [];
  }

  _createClass(ArgumentList, [{
    key: "addArgument",
    value: function addArgument(name, value) {
      (0, _validation.assertValidString)(name, 'Argument name');
      var gqlValue = jsToGQLValue(value);
      var arg = {
        name: name,
        value: gqlValue
      };
      this.args.push(arg);
      return this;
    }
  }, {
    key: "toASTNodeArray",
    value: function toASTNodeArray() {
      return this.args.map(function (_ref) {
        var name = _ref.name,
            value = _ref.value;
        return t.argument(t.name(name), value);
      });
    }
  }], [{
    key: "build",
    value: function build(args) {
      var argumentList = new ArgumentList();

      if ((0, _lodash.isFunction)(args)) {
        args(argumentList);
      } else if ((0, _lodash.isPlainObject)(args)) {
        (0, _lodash.toPairs)(args).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              name = _ref3[0],
              value = _ref3[1];

          argumentList.addArgument(name, value);
        });
      } else {
        (0, _validation.assertIsOfTypeOrNull)(args, ArgumentList);
        argumentList = args;
      }

      return argumentList;
    }
  }]);

  return ArgumentList;
}();

exports.ArgumentList = ArgumentList;

var Field =
/*#__PURE__*/
function () {
  function Field() {
    _classCallCheck(this, Field);

    this.name = null;
    this.alias = null;
    this.argList = null;
    this.selectionSet = null;
  }

  _createClass(Field, [{
    key: "setName",
    value: function setName(name) {
      (0, _validation.assertValidString)(name, 'Field name');
      this.name = name;
      return this;
    }
  }, {
    key: "setAlias",
    value: function setAlias(alias) {
      (0, _validation.assertValidStringOrNull)(alias, 'Field alias');
      this.alias = alias;
      return this;
    }
    /**
     * @param ArgumentList|Function<ArgumentList> args
     */

  }, {
    key: "setArguments",
    value: function setArguments() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (args === null) {
        this.argList = null;
        return this;
      }

      this.argList = ArgumentList.build(args);
      return this;
    }
  }, {
    key: "setSelectionSet",
    value: function setSelectionSet() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (args === null) {
        this.selectionSet = null;
        return this;
      }

      this.selectionSet = SelectionSet.build(args);
      return this;
    }
  }, {
    key: "toASTNode",
    value: function toASTNode() {
      return t.field(t.name(this.name), this.alias ? t.name(this.alias) : null, this.argList ? this.argList.toASTNodeArray() : null, null, // Ignoring directives
      this.selectionSet ? this.selectionSet.toASTNode() : null);
    }
  }, {
    key: "print",
    value: function print() {
      return (0, _language.print)(this.toASTNode());
    } // TODO : switch to single argument, for better semantics across builders

  }], [{
    key: "build",
    value: function build(name) {
      var alias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var selectionSet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (name instanceof Field) {
        return name;
      }

      var field = new Field();
      field.setName(name).setAlias(alias).setArguments(args).setSelectionSet(selectionSet);
      return field;
    }
  }]);

  return Field;
}();

exports.Field = Field;

var SelectionSet =
/*#__PURE__*/
function () {
  function SelectionSet() {
    _classCallCheck(this, SelectionSet);

    this.fields = [];
  }

  _createClass(SelectionSet, [{
    key: "addField",
    value: function addField() {
      var field = Field.build.apply(Field, arguments);
      this.fields.push(field);
      return this;
    }
  }, {
    key: "toASTNode",
    value: function toASTNode() {
      return t.selectionSet(this.fields.map(function (field) {
        return field.toASTNode();
      }));
    }
  }, {
    key: "print",
    value: function print() {
      return (0, _language.print)(this.toASTNode());
    }
  }], [{
    key: "build",
    value: function build(args) {
      if (args instanceof SelectionSet) return args;
      var selectionSet = new SelectionSet();

      if ((0, _lodash.isArray)(args)) {
        args.forEach(function (arg) {
          if ((0, _lodash.isArray)(arg)) selectionSet.addField.apply(selectionSet, _toConsumableArray(arg));else selectionSet.addField(arg);
        });
      } else if ((0, _lodash.isFunction)(args)) {
        args(selectionSet);
      } else {
        throw new Error('Cannot build SelectionSet with given arguments');
      }

      return selectionSet;
    }
  }]);

  return SelectionSet;
}();

exports.SelectionSet = SelectionSet;

var OperationDefinition =
/*#__PURE__*/
function () {
  function OperationDefinition() {
    _classCallCheck(this, OperationDefinition);

    this.name = null;
    this.selectionSet = new SelectionSet();
    this.operation = 'query';
  }

  _createClass(OperationDefinition, [{
    key: "addField",
    value: function addField() {
      var _this$selectionSet;

      (_this$selectionSet = this.selectionSet).addField.apply(_this$selectionSet, arguments);

      return this;
    }
  }, {
    key: "setName",
    value: function setName(name) {
      (0, _validation.assertValidStringOrNull)(name, 'Operation name');
      this.name = name;
      return this;
    }
  }, {
    key: "setOperation",
    value: function setOperation(operation) {
      (0, _validation.assertValidOperation)(operation);
      this.operation = operation;
      return this;
    }
  }, {
    key: "setSelectionSet",
    value: function setSelectionSet() {
      this.selectionSet = SelectionSet.build.apply(SelectionSet, arguments);
      return this;
    }
  }, {
    key: "toASTNode",
    value: function toASTNode() {
      return t.operationDefinition(this.operation, this.selectionSet.toASTNode(), this.name ? t.name(this.name) : null);
    }
  }, {
    key: "print",
    value: function print() {
      return (0, _language.print)(this.toASTNode());
    }
    /**
     * @param {string} type The type of the operation
     */

  }], [{
    key: "build",
    value: function build(type, args) {
      if (type instanceof OperationDefinition) return type;
      var operation = new OperationDefinition();
      var realArgs = type;

      if ((0, _lodash.isString)(type)) {
        operation.setOperation(type);
        realArgs = args;

        if ((0, _lodash.isArray)(args)) {
          realArgs = [type].concat(_toConsumableArray(args));
        }
      }

      if ((0, _lodash.isArray)(realArgs)) {
        operation.setOperation(realArgs[0]);
        operation.setSelectionSet(realArgs[1]);
        operation.setName(realArgs[2]);
      } else if ((0, _lodash.isFunction)(realArgs)) {
        realArgs(operation);
      } else {
        throw new Error('Cannot build OperationDefinition with given arguments');
      }

      return operation;
    }
  }]);

  return OperationDefinition;
}();

exports.OperationDefinition = OperationDefinition;

var Query =
/*#__PURE__*/
function (_OperationDefinition) {
  _inherits(Query, _OperationDefinition);

  function Query() {
    _classCallCheck(this, Query);

    return _possibleConstructorReturn(this, _getPrototypeOf(Query).apply(this, arguments));
  }

  _createClass(Query, null, [{
    key: "build",
    value: function build(args) {
      return OperationDefinition.build('query', args);
    }
  }]);

  return Query;
}(OperationDefinition);

exports.Query = Query;

var Mutation =
/*#__PURE__*/
function (_OperationDefinition2) {
  _inherits(Mutation, _OperationDefinition2);

  function Mutation() {
    var _this;

    _classCallCheck(this, Mutation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Mutation).call(this));
    _this.operation = 'mutation';
    return _this;
  }

  _createClass(Mutation, null, [{
    key: "build",
    value: function build(args) {
      return OperationDefinition.build('mutation', args);
    }
  }]);

  return Mutation;
}(OperationDefinition);

exports.Mutation = Mutation;

var Subscription =
/*#__PURE__*/
function (_OperationDefinition3) {
  _inherits(Subscription, _OperationDefinition3);

  function Subscription() {
    var _this2;

    _classCallCheck(this, Subscription);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Subscription).call(this));
    _this2.operation = 'subscription';
    return _this2;
  }

  _createClass(Subscription, null, [{
    key: "build",
    value: function build(args) {
      return OperationDefinition.build('subscription', args);
    }
  }]);

  return Subscription;
}(OperationDefinition);

exports.Subscription = Subscription;

var Document =
/*#__PURE__*/
function () {
  function Document() {
    _classCallCheck(this, Document);

    this.operations = [];
  }

  _createClass(Document, [{
    key: "addQuery",
    value: function addQuery() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.addOperation.apply(this, ['query'].concat(args));
    }
  }, {
    key: "addMutation",
    value: function addMutation() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.addOperation.apply(this, ['mutation'].concat(args));
    }
  }, {
    key: "addSubscription",
    value: function addSubscription() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.addOperation.apply(this, ['subscription'].concat(args));
    }
  }, {
    key: "addOperation",
    value: function addOperation(type) {
      if (type instanceof OperationDefinition) {
        this.operations.push(type);
        return this;
      }

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var operation = OperationDefinition.build(type, args);
      this.operations.push(operation);
      return this;
    }
  }, {
    key: "toASTNode",
    value: function toASTNode() {
      return t.document(this.operations.map(function (op) {
        return op.toASTNode();
      }));
    }
  }, {
    key: "print",
    value: function print() {
      return (0, _language.print)(this.toASTNode());
    }
  }], [{
    key: "build",
    value: function build(args) {
      var document = new Document();

      if ((0, _lodash.isArray)(args)) {
        args.forEach(function (a) {
          return document.addOperation(a);
        });
      } else if ((0, _lodash.isFunction)(args)) {
        args(document);
      } else if ((0, _lodash.isPlainObject)(args)) {
        ['query', 'mutation', 'subscription'].forEach(function (type) {
          if (args[type]) {
            document.addOperation(type, args[type], args.name);
          }
        });
      } else {
        throw new Error('Cannot build Document with given arguments');
      }

      return document;
    }
  }]);

  return Document;
}();

exports.Document = Document;