"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Process = require("./Process");

var _Process2 = _interopRequireDefault(_Process);

/**
 * Creates a new Process
 *
 * @param  {String}     command   to be executed
 * @param  {Condition?} condition as filter
 * @return {Process}
 */

exports["default"] = function (command) {
  var condition = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
  return _Process2["default"].create(command, condition);
};

module.exports = exports["default"];

//# sourceMappingURL=index.js.map