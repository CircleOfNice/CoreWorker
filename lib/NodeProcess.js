/*
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
 *
 * Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
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

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _child_process = require("child_process");

var _lodash = require("lodash");

var _events = require("events");

var _Result = require("./Result");

var _Result2 = _interopRequireDefault(_Result);

var _NotNilType = require("./NotNil.type");

var _NotNilType2 = _interopRequireDefault(_NotNilType);

var _TimeoutError = require("./TimeoutError");

var _TimeoutError2 = _interopRequireDefault(_TimeoutError);

var _setDefaultValue = require("set-default-value");

var _setDefaultValue2 = _interopRequireDefault(_setDefaultValue);

/**
 * Collects data and emits it afterwards
 *
 * @param  {String}   data received from process.output
 */
_NodeProcessType2["default"].prototype.validate = _tcomb2["default"].func([_tcomb2["default"].String], _tcomb2["default"].Nil, "nodeProcess.validate").of(function (data) {
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
_NodeProcessType2["default"].prototype.store = _tcomb2["default"].func([_tcomb2["default"].String], _tcomb2["default"].Nil, "nodeProcess.store").of(function (data) {
    (0, _lodash.assign)(this.instance, {
        output: this.instance.output.concat([data])
    });
});

/**
 * Starts the Process of current instance
 *
 * @param {Index?} maybeTimeout after that a timeout event gets emitted
 */
_NodeProcessType2["default"].prototype.run = function (maybeTimeout) {
    var _this = this;

    if (this.isRunning()) return;

    var process = (0, _child_process.spawn)(this.command, this.commandArgs);
    var timeout = (0, _setDefaultValue2["default"])(maybeTimeout).to(0);

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
    process.on("close", function (code, signal) {
        return code === 0 || _NotNilType2["default"].is(signal) ? _this.finish.call(_this) : _this.terminate.call(_this, code);
    });

    (0, _lodash.assign)(this.instance, process, {
        isRunning: true,
        kill: process.kill
    });
    setTimeout(function () {
        return timeout > 0 ? _this.emitter.emit("timeout") : null;
    }, timeout);
};

/**
 * Streams data in process.stdin
 *
 * @param  {Buffer} chunk piped in stdin
 */
_NodeProcessType2["default"].prototype.write = _tcomb2["default"].func([_tcomb2["default"].Object], _tcomb2["default"].Nil, "nodeProcess.write").of(function (chunk) {
    this.instance.stdin.write(chunk);
});

/**
 * Signals the instance, that it is streaming
 */
_NodeProcessType2["default"].prototype.startStream = _tcomb2["default"].func([], _tcomb2["default"].Nil, "nodeProcess.startStream").of(function () {
    (0, _lodash.assign)(this.instance, {
        isStreaming: true
    });
});

/**
 * Flushs all data piped into stdin
 */
_NodeProcessType2["default"].prototype.end = _tcomb2["default"].func([], _tcomb2["default"].Nil, "nodeProcess.end").of(function () {
    (0, _lodash.assign)(this.instance, {
        isStreaming: false
    });
    this.instance.stdin.end();
});

/**
 * Kills a running instance
 *
 * @return {Boolean}
 */
_NodeProcessType2["default"].prototype.kill = _tcomb2["default"].func([], _tcomb2["default"].Boolean, "nodeProcess.kill").of(function () {
    if (!this.isRunning()) return true;

    if (this.instance.isStreaming) this.instance.stdin.pause();
    return this.instance.kill();
});

/**
 * Emits an Error if process was closed unexpectedly
 *
 * @param {Index} code as exit status of the instance
 */
_NodeProcessType2["default"].prototype.terminate = _tcomb2["default"].func([_tcomb2["default"].Number], _tcomb2["default"].Nil, "nodeProcess.terminate").of(function (code) {
    (0, _lodash.assign)(this.instance, { isRunning: false });
    this.emitter.emit("failure", new Error("Process was closed unexpectedly. Code: " + code));
});

/**
 * Emits result after process was closed
 */
_NodeProcessType2["default"].prototype.finish = _tcomb2["default"].func([], _tcomb2["default"].Nil, "nodeProcess.finish").of(function () {
    (0, _lodash.assign)(this.instance, { isRunning: false });
    this.emitter.emit("death", _Result2["default"].create(this.instance.output.join("")));
});

/**
 * Stores a callback, that gets called, when process ends
 *
 * @param {Promise} deferred executed after Process was closed
 */
_NodeProcessType2["default"].prototype.onDeath = _tcomb2["default"].func([_tcomb2["default"].Object], _tcomb2["default"].Nil, "nodeProcess.onDeath").of(function (deferred) {
    this.emitter.on("death", deferred.resolve);
    this.emitter.on("failure", deferred.reject);
});

/**
 * Stores a callback, that gets called, when process is ready
 *
 * @param  {Function} cb executed, when process is ready
 */
_NodeProcessType2["default"].prototype.onReady = _tcomb2["default"].func([_tcomb2["default"].Function], _tcomb2["default"].Nil, "nodeProcess.onReady").of(function (cb) {
    this.emitter.on("ready", cb);
});

/**
 * Stores a callback, that gets called, when process logs in stdout/stderr
 *
 * @param  {Function} cb executed on Output
 */
_NodeProcessType2["default"].prototype.onData = _tcomb2["default"].func([_tcomb2["default"].Function], _tcomb2["default"].Nil, "nodeProcess.onData").of(function (cb) {
    this.emitter.on("data", cb);
});

/**
 * Stores a deferrable that will be rejected on an emitted timeout event
 *
 * @param {Promise} deferred to be rejected on timeout event
 */
_NodeProcessType2["default"].prototype.onTimeout = _tcomb2["default"].func([_tcomb2["default"].Object], _tcomb2["default"].Nil, "nodeProcess.onTimeout").of(function (deferred) {
    var _this2 = this;

    this.emitter.on("timeout", function () {
        return deferred.reject(_TimeoutError2["default"].create((0, _lodash.last)(_this2.instance.output)));
    });
});

/**
 * Returns current state of Process
 *
 * @return {Boolean}
 */
_NodeProcessType2["default"].prototype.isRunning = _tcomb2["default"].func([], _tcomb2["default"].Boolean, "nodeProcess.isRunning").of(function () {
    return this.instance.isRunning;
});

/**
 * Returns if process is ready
 *
 * @return {Boolean}
 */
_NodeProcessType2["default"].prototype.isReady = _tcomb2["default"].func([], _tcomb2["default"].Boolean, "nodeProcess.isReady").of(function () {
    return this.instance.fulfilled;
});

/**
 * Returns last match
 *
 * @return {String?}
 */
_NodeProcessType2["default"].prototype.lastMatch = _tcomb2["default"].func([], _tcomb2["default"].maybe(_tcomb2["default"].String), "nodeProcess.lastMatch").of(function () {
    return this.instance.lastMatch;
});

/**
 * Creates a new Instance of NodeProcess
 *
 * @param  {String}      command   which will be executed
 * @param  {Condition}   condition to filter logs
 * @return {NodeProcess}
 */
_NodeProcessType2["default"].create = _tcomb2["default"].func([_tcomb2["default"].String, _ConditionType2["default"]], _NodeProcessType2["default"], "NodeProcess.create").of(function (command, condition) {
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
            isStreaming: false,
            output: [],
            lastMatch: null,
            fulfilled: false
        }
    };
});

exports["default"] = _NodeProcessType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=NodeProcess.js.map