/* Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 *
 * This file is part of CoreWorker.
 *
 * CoreWorker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CoreWorker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with CoreWorker.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Validator = require("./Validator");

var _Validator2 = _interopRequireDefault(_Validator);

var _NodeProcessType = require("./NodeProcess.type");

var _NodeProcessType2 = _interopRequireDefault(_NodeProcessType);

var _ConditionType = require("./Condition.type");

var _ConditionType2 = _interopRequireDefault(_ConditionType);

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _child_process = require("child_process");

var _lodash = require("lodash");

var _events = require("events");

var _Result = require("./Result");

var _Result2 = _interopRequireDefault(_Result);

/**
 * Collects data and emits it afterwards
 *
 * @param  {String}   data received from process.output
 */
_NodeProcessType2["default"].prototype.validate = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String], _circleCoreTypes2["default"].Nil, "nodeProcess.validate").of(function (data) {
    if (_Result2["default"].is(this.instance.result) || !this.filter.validate(data)) return;

    var result = this.filter.getResult(data);

    (0, _lodash.assign)(this.instance, {
        result: result,
        fulfilled: true
    });

    this.emitter.emit("ready", result);
});

/**
 * Stores new output
 *
 * @param  {String} data to be stored
 */
_NodeProcessType2["default"].prototype.store = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String], _circleCoreTypes2["default"].Nil, "nodeProcess.store").of(function (data) {
    (0, _lodash.assign)(this.instance, {
        output: this.instance.output.concat([data])
    });
});

/**
 * Starts the Process of current instance
 */
_NodeProcessType2["default"].prototype.run = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Nil, "NodeProcess.run").of(function () {
    var _this = this;

    if (this.isRunning()) return;

    var process = (0, _child_process.spawn)(this.command, this.commandArgs);

    this.emitter.on("data", function (data) {
        return _this.store(data.toString());
    });
    this.emitter.on("data", function (data) {
        return _this.validate(data.toString());
    });
    process.stdout.on("data", function (data) {
        return _this.emitter.emit("data", data.toString());
    });
    process.stderr.on("data", function (data) {
        return _this.emitter.emit("data", "<error> " + data);
    });
    process.on("close", function () {
        return _this.emitter.emit("death", _Result2["default"].create(_this.instance.output.join(""))) && (0, _lodash.assign)(_this.instance, { isRunning: false });
    });

    (0, _lodash.assign)(this.instance, process, {
        isRunning: true,
        kill: process.kill
    });
});

/**
 * Streams data in process.stdin
 *
 * @param  {Buffer} chunk piped in stdin
 */
_NodeProcessType2["default"].prototype.write = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].Object], _circleCoreTypes2["default"].Nil, "nodeProcess.write").of(function (chunk) {
    this.instance.stdin.write(chunk);
});

/**
 * Flushs all data piped into stdin
 */
_NodeProcessType2["default"].prototype.end = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Nil, "nodeProcess.end").of(function () {
    this.instance.stdin.end();
});

/**
 * Kills a running instance
 */
_NodeProcessType2["default"].prototype.kill = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Nil, "nodeProcess.kill").of(function () {
    if (!this.isRunning()) return;

    this.instance.kill();
});

/**
 * Stores a callback, that gets called, when process ends
 *
 * @param  {Function} cb executed after Process was closed
 */
_NodeProcessType2["default"].prototype.onDeath = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].Function], _circleCoreTypes2["default"].Nil, "nodeProcess.onDeath").of(function (cb) {
    this.emitter.on("death", cb);
});

/**
 * Stores a callback, that gets called, when process is ready
 *
 * @param  {Function} cb executed, when process is ready
 */
_NodeProcessType2["default"].prototype.onReady = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].Function], _circleCoreTypes2["default"].Nil, "nodeProcess.onReady").of(function (cb) {
    this.emitter.on("ready", cb);
});

/**
 * Stores a callback, that gets called, when process logs in stdout/stderr
 *
 * @param  {Function} cb executed on Output
 */
_NodeProcessType2["default"].prototype.onData = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].Function], _circleCoreTypes2["default"].Nil, "nodeProcess.onData").of(function (cb) {
    this.emitter.on("data", cb);
});

/**
 * Returns current state of Process
 *
 * @return {Boolean}
 */
_NodeProcessType2["default"].prototype.isRunning = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Boolean, "nodeProcess.isRunning").of(function () {
    return this.instance.isRunning;
});

/**
 * Returns if process is ready
 *
 * @return {Boolean}
 */
_NodeProcessType2["default"].prototype.isReady = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Boolean, "nodeProcess.isReady").of(function () {
    return this.instance.fulfilled;
});

/**
 * Returns last match
 *
 * @return {String?}
 */
_NodeProcessType2["default"].prototype.lastMatch = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].maybe(_circleCoreTypes2["default"].String), "nodeProcess.lastMatch").of(function () {
    return this.instance.lastMatch;
});

/**
 * Creates a new Instance of NodeProcess
 *
 * @param  {String}      command   which will be executed
 * @param  {Condition}   condition to filter logs
 * @return {NodeProcess}
 */
_NodeProcessType2["default"].create = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String, _ConditionType2["default"]], _NodeProcessType2["default"], "NodeProcess.create").of(function (command, condition) {
    var filter = _Validator2["default"].create(condition);
    var emitter = new _events.EventEmitter();
    var splittedCommand = command.split(" ");

    return {
        emitter: emitter,
        command: (0, _lodash.first)(splittedCommand),
        commandArgs: splittedCommand.slice(1),
        filter: filter,
        instance: {
            isRunning: false,
            output: [],
            lastMatch: null,
            fulfilled: false
        }
    };
});

exports["default"] = _NodeProcessType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=NodeProcess.js.map