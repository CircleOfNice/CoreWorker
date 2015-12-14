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

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

/**
 * Awaits the death of a (running) process
 *
 * @param  {Index?}  maybeTimeout until process should have died
 * @return {Promise}
 */
_ProcessType2["default"].prototype.death = function (maybeTimeout) {
  var timeout = _circleCoreTypes2["default"].Index((0, _setDefaultValue2["default"])(maybeTimeout).to(0));
  var deferred = _q2["default"].defer();

  this.instance.onDeath(deferred);
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
  (0, _assert2["default"])(!this.instance.isRunning(), "Can't use stream after process initialization");

  this.instance.run();

  return new _DuplexStream2["default"](this.instance);
});

/**
 * Kills a running Process
 *
 * @param {String} signal to kill the process
 */
_ProcessType2["default"].prototype.kill = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Nil, "process.kill").of(function () {
  this.instance.kill();
});

/**
 * Creates a new Process
 *
 * @param  {String}    command   executed in Process
 * @param  {Condition} condition as filter
 * @return {Process}
 */
_ProcessType2["default"].create = function (command) {
  var condition = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

  return (0, _ProcessType2["default"])({
    instance: _NodeProcess2["default"].create(_circleCoreTypes2["default"].String(command), (0, _ConditionType2["default"])(condition))
  });
};

exports["default"] = _ProcessType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=Process.js.map