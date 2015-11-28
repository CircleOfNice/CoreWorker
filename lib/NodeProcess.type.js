"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _ValidatorType = require("./Validator.type");

var _ValidatorType2 = _interopRequireDefault(_ValidatorType);

var _InstanceType = require("./Instance.type");

var _InstanceType2 = _interopRequireDefault(_InstanceType);

/**
 * @typedef NodeProcess
 */
exports["default"] = _circleCoreTypes2["default"].struct({
    emitter: _circleCoreTypes2["default"].Object,
    instance: _InstanceType2["default"],
    filter: _ValidatorType2["default"],
    command: _circleCoreTypes2["default"].String,
    commandArgs: _circleCoreTypes2["default"].list(_circleCoreTypes2["default"].String)
}, "NodeProcess");
module.exports = exports["default"];

//# sourceMappingURL=NodeProcess.type.js.map