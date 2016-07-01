"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

var _Process = require("./Process.type");

var _Process2 = _interopRequireDefault(_Process);

var _NodeProcess = require("./NodeProcess");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

var _DuplexStream = require("./DuplexStream");

var _DuplexStream2 = _interopRequireDefault(_DuplexStream);

var _DuplexStream3 = require("./DuplexStream.type");

var _DuplexStream4 = _interopRequireDefault(_DuplexStream3);

var _setDefaultValue = require("set-default-value");

var _setDefaultValue2 = _interopRequireDefault(_setDefaultValue);

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _Condition = require("./Condition.type");

var _Condition2 = _interopRequireDefault(_Condition);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Awaits the death of a (running) process
 *
 * @param  {Index?}  maybeTimeout until process should have died
 * @return {Promise}
 */
_Process2.default.prototype.death = function (maybeTimeout) {
  if (_tcomb2.default.Nil.is(maybeTimeout)) this.instance.kill();

  var timeout = _tcomb2.default.Number((0, _setDefaultValue2.default)(maybeTimeout).to(0));
  var deferred = _q2.default.defer();

  this.instance.onDeath(deferred);
  this.instance.onTimeout(deferred);
  this.instance.run(timeout);

  return deferred.promise;
};

/**
 * Awaits the initialized process
 *
 * @param  {Index}   timeout until instance should be ready
 * @return {Promise}
 */
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
 * Copyright 2016 TeeAge-Beatz UG (haftungsbeschränkt)
 */

_Process2.default.prototype.ready = _tcomb2.default.func([_tcomb2.default.Number], _tcomb2.default.Object, "process.ready").of(function (timeout) {
  if (this.instance.isRunning() && this.instance.isReady()) return this.instance.lastMatch();

  var deferred = _q2.default.defer();

  this.instance.onReady(deferred.resolve);
  this.instance.onTimeout(deferred);
  this.instance.run(timeout);

  return deferred.promise;
});

/**
 * Starts a new DuplexStream, listening on DataOutput of a new Process-Instance
 *
 * @return {DuplexStream}
 */
_Process2.default.prototype.stream = _tcomb2.default.func([], _DuplexStream4.default, "process.stream").of(function () {
  (0, _assert2.default)(!this.instance.isRunning(), "Can't use stream after process initialization");

  this.instance.run();

  return new _DuplexStream2.default(this.instance);
});

/**
 * Kills a running Process
 *
 * @param {String} signal to kill the process
 */
_Process2.default.prototype.kill = _tcomb2.default.func([], _tcomb2.default.Object, "process.kill").of(function () {
  return this.instance.kill();
});

/**
 * Creates a new Process
 *
 * @param  {String}    command   executed in Process
 * @param  {Condition} condition as filter
 * @return {Process}
 */
_Process2.default.create = function (command) {
  var condition = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

  return (0, _Process2.default)({
    instance: _NodeProcess2.default.create(_tcomb2.default.String(command), (0, _Condition2.default)(condition))
  });
};

exports.default = _Process2.default;

//# sourceMappingURL=Process.js.map