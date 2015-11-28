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
