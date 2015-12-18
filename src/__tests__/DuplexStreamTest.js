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
        startStream: () => {},
        write:       chunk => spy(chunk),
        end:         () => {}
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
        assert(metrics.spies.write.calledWith(new Buffer("First call")), "Should be called with 'First Call'");

        metrics.callbacks.data("Second call");
        assert(metrics.spies.write.calledWith(new Buffer("Second call")), "Should be called with 'Second Call'");

        metrics.instance.end();
    });
});
