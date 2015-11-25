import DuplexStream from "../DuplexStream";
import { Writable } from "stream";
import sinon from "sinon";
import assert from "assert";
import { set } from "lodash";

const getInstance = function(callbacks, spy) {
    return {
        emitter: {
            on: (name, cb) => set(callbacks, name, cb)
        },
        write: chunk => spy(chunk)
    };
};

const prepareTest = function() {
    const callbacks = {};
    const stdinSpy  = sinon.spy();
    const writeSpy  = sinon.spy();
    const instance  = new DuplexStream(getInstance(callbacks, stdinSpy));
    const writeable = new Writable();

    writeable.write = data => writeSpy(data);
    instance.pipe(writeable);

    return {
        spies: {
            stdin: stdinSpy,
            write: writeSpy
        },
        callbacks: callbacks,
        instance:  instance
    };
};

describe("DuplexStream", function() {
    it("Writestream Test", function() {
        const metrics = prepareTest();

        metrics.instance.write("Hello");
        assert(metrics.spies.stdin.calledWith(new Buffer("Hello")), "Should be called with Hello");
        metrics.instance.write("Goodbye");
        assert(metrics.spies.stdin.calledWith(new Buffer("Goodbye")), "Should be called with Goodbye");

        metrics.instance.end();
    });

    it("ReadStream Test", function() {
        const metrics = prepareTest();

        metrics.callbacks.data("First call");
        assert(metrics.spies.write.calledWith("First call"), "Should be called with 'First Call'");

        metrics.callbacks.data("Second call");
        assert(metrics.spies.write.calledWith("Second call"), "Should be called with 'Second Call'");

        metrics.instance.end();
    });
});
