"use strict";

var _DuplexStream = require("../DuplexStream");

var _DuplexStream2 = _interopRequireDefault(_DuplexStream);

var _stream = require("stream");

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getInstance = function getInstance(callbacks, spy) {
    return {
        emitter: {
            on: function on(name, cb) {
                return (0, _lodash.set)(callbacks, name, cb);
            }
        },
        startStream: function startStream() {},
        write: function write(chunk) {
            return spy(chunk);
        },
        end: function end() {}
    };
}; /*
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

var prepareTest = function prepareTest() {
    var callbacks = {};
    var stdinSpy = _sinon2.default.spy();
    var writeSpy = _sinon2.default.spy();
    var instance = new _DuplexStream2.default(getInstance(callbacks, stdinSpy));
    var writeable = new _stream.Writable();

    writeable.write = function (data) {
        return writeSpy(data);
    };
    instance.pipe(writeable);

    return {
        spies: {
            stdin: stdinSpy,
            write: writeSpy
        },
        callbacks: callbacks,
        instance: instance
    };
};

describe("DuplexStream", function () {
    it("Writestream Test", function () {
        var metrics = prepareTest();

        metrics.instance.write("Hello");
        (0, _assert2.default)(metrics.spies.stdin.calledWith(new Buffer("Hello")), "Should be called with Hello");
        metrics.instance.write("Goodbye");
        (0, _assert2.default)(metrics.spies.stdin.calledWith(new Buffer("Goodbye")), "Should be called with Goodbye");

        metrics.instance.end();
    });

    it("ReadStream Test", function () {
        var metrics = prepareTest();

        metrics.callbacks.data("First call");
        (0, _assert2.default)(metrics.spies.write.calledWith(new Buffer("First call")), "Should be called with 'First Call'");

        metrics.callbacks.data("Second call");
        (0, _assert2.default)(metrics.spies.write.calledWith(new Buffer("Second call")), "Should be called with 'Second Call'");

        metrics.instance.end();
    });
});

//# sourceMappingURL=DuplexStreamTest.js.map