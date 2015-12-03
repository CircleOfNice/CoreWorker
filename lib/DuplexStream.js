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

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stream = require("stream");

var DuplexStream = (function (_Writable) {
    _inherits(DuplexStream, _Writable);

    function DuplexStream(instance) {
        _classCallCheck(this, DuplexStream);

        _get(Object.getPrototypeOf(DuplexStream.prototype), "constructor", this).call(this);

        this.instance = instance;
    }

    /**
     * Pipes data into process's stdin
     *
     * @param {Buffer}   chunk    forwarded to stdin
     * @param {String}   encoding of current chunk
     * @param {Function} next     to finalize a chunk
     */

    _createClass(DuplexStream, [{
        key: "_write",
        value: function _write(chunk, encoding, next) {
            this.instance.write(chunk);

            next();
        }
    }, {
        key: "end",
        value: function end() {
            this.instance.end();
        }

        /*
         * Registers a Stream to pipe in
         *
         * @param  {Stream} stream to pipe in
         * @return {Stream}
         */
    }, {
        key: "pipe",
        value: function pipe(stream) {
            this.instance.emitter.on("data", stream.write.bind(stream));

            return stream;
        }
    }]);

    return DuplexStream;
})(_stream.Writable);

exports["default"] = DuplexStream;
module.exports = exports["default"];

//# sourceMappingURL=DuplexStream.js.map