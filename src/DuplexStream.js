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

import { Writable } from "stream";

export default class DuplexStream extends Writable {
    constructor(instance) {
        super();

        this.instance = instance;
    }

    /**
     * Pipes data into process's stdin
     *
     * @param {Buffer}   chunk    forwarded to stdin
     * @param {String}   encoding of current chunk
     * @param {Function} next     to finalize a chunk
     */
    _write(chunk, encoding, next) {
        this.instance.write(chunk);

        next();
    }

    end() {
        this.instance.end();
    }

    /*
     * Registers a Stream to pipe in
     *
     * @param  {Stream} stream to pipe in
     * @return {Stream}
     */
    pipe(stream) {
        this.instance.emitter.on("data", ::stream.write);

        return stream;
    }
}
