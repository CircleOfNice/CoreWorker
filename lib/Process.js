"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

var _ProcessType = require("./Process.type");

var _ProcessType2 = _interopRequireDefault(_ProcessType);

var _NodeProcess = require("./NodeProcess");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

var _DuplexStream = require("./DuplexStream");

var _DuplexStream2 = _interopRequireDefault(_DuplexStream);

var _DuplexStreamType = require("./DuplexStream.type");

var _DuplexStreamType2 = _interopRequireDefault(_DuplexStreamType);

var _setDefaultValue = require("set-default-value");

var _setDefaultValue2 = _interopRequireDefault(_setDefaultValue);

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _ConditionType = require("./Condition.type");

var _ConditionType2 = _interopRequireDefault(_ConditionType);

/**
 * Awaits the death of a (running) process
 *
 * @param  {Index?}  maybeTimeout until process should have died
 * @return {Promise}
 */
_ProcessType2["default"].prototype.death = function (maybeTimeout) {
    var timeout = _circleCoreTypes2["default"].Index((0, _setDefaultValue2["default"])(maybeTimeout).to(0));
    var deferred = _q2["default"].defer();

    this.instance.onDeath(deferred.resolve);
    this.instance.run();
    setTimeout(function () {
        return timeout === 0 ? null : deferred.reject(new Error("Timeout exceeded."));
    }, timeout);

    return deferred.promise;
};

/**
 * Awaits the initialized process
 *
 * @param  {Index}   timeout until instance should be ready
 * @return {Promise}
 */
_ProcessType2["default"].prototype.ready = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].Index], _circleCoreTypes2["default"].Object, "process.ready").of(function (timeout) {
    if (this.instance.isRunning() && this.instance.isReady()) return this.instance.lastMatch();

    var deferred = _q2["default"].defer();

    this.instance.onReady(deferred.resolve);
    this.instance.run();
    setTimeout(deferred.reject, timeout, new Error("Timeout exceeded."));

    return deferred.promise;
});

/**
 * Starts a new DuplexStream, listening on DataOutput of a new Process-Instance
 *
 * @return {DuplexStream}
 */
_ProcessType2["default"].prototype.stream = _circleCoreTypes2["default"].func([], _DuplexStreamType2["default"], "process.stream").of(function () {
    if (this.instance.isRunning()) throw new Error("Can't use stream after process initialization");

    this.instance.run();

    return new _DuplexStream2["default"](this.instance);
});

/**
 * Kills a running Process
 *
 * @param {String} reason to kill the process
 */
_ProcessType2["default"].prototype.kill = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String], _circleCoreTypes2["default"].Nil, "process.kill").of(function (reason) {
    this.instance.kill(reason);
});

/**
 * Creates a new Process
 *
 * @param  {String}    command   executed in Process
 * @param  {Condition} condition as filter
 * @return {Process}
 */
_ProcessType2["default"].create = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String, _ConditionType2["default"]], _ProcessType2["default"], "Process.create").of(function (command, condition) {
    return {
        instance: _NodeProcess2["default"].create(command, condition)
    };
});

exports["default"] = _ProcessType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=Process.js.map