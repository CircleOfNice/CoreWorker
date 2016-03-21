"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _stream = require("stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DuplexStream = function (_Transform) {
    (0, _inherits3.default)(DuplexStream, _Transform);

    function DuplexStream(instance) {
        (0, _classCallCheck3.default)(this, DuplexStream);

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DuplexStream).call(this));

        _this.instance = instance;

        _this.instance.startStream();
        _this.instance.emitter.on("data", _this.push.bind(_this));
        return _this;
    }

    /**
     * Pipes data into process's stdin
     *
     * @param {Buffer}   chunk    forwarded to stdin
     * @param {String}   encoding of current chunk
     * @param {Function} next     to finalize a chunk
     */


    (0, _createClass3.default)(DuplexStream, [{
        key: "_transform",
        value: function _transform(chunk, encoding, next) {
            this.instance.write(chunk);

            next();
        }

        /**
         * process.stdin ends with the readable stream
         * to process the piped data
         */

    }, {
        key: "end",
        value: function end() {
            this.instance.end();
        }
    }]);
    return DuplexStream;
}(_stream.Transform); /*
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

exports.default = DuplexStream;

//# sourceMappingURL=DuplexStream.js.map