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

import { process } from "../index";
import assert from "assert";
import T from "tcomb";
import { Writable } from "stream";
import path from "path";

const counterScript  = path.join(__dirname, "/Scripts/CounterScript.js");
const stdinLogger    = path.join(__dirname, "/Scripts/StdinLogger.js");
const failScript     = path.join(__dirname, "/Scripts/FailScript.js");
const exitCodeScript = path.join(__dirname, "/Scripts/ExitCodeScript.js");
const killScript     = path.join(__dirname, "/Scripts/KillScript.js");

describe("CoreWorker", function() { //eslint-disable-line
    it("executes an application and waits until it is ready", async function() {
        this.timeout(5000);
        const counter = process(`node ${counterScript}`, "Log No. 10");

        const result = await counter.ready(2000);

        assert.deepStrictEqual(
            result.output.join(""),
            "Log No. 1\n" +
            "Log No. 2\n" +
            "Log No. 3\n" +
            "Log No. 4\n" +
            "Log No. 5\n" +
            "Log No. 6\n" +
            "Log No. 7\n" +
            "Log No. 8\n" +
            "Log No. 9\n" +
            "Log No. 10\n"
        );

        assert.equal(result.isRunning, true, "Expected process to be running");
        assert(T.Number.is(result.pid) && result.pid > 0, "Should have a pid");

        assert.deepEqual((await counter.kill()).data.split("\n"), [
            "Log No. 1",
            "Log No. 2",
            "Log No. 3",
            "Log No. 4",
            "Log No. 5",
            "Log No. 6",
            "Log No. 7",
            "Log No. 8",
            "Log No. 9",
            "Log No. 10"
        ]);
    });

    it("executes an application and waits until it is ready", async function() {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 5/);

        const result = await counter.ready(2000); // eslint-disable-line

        assert.deepStrictEqual(result.output, [
            "Log No. 1\n",
            "Log No. 2\n",
            "Log No. 3\n",
            "Log No. 4\n",
            "Log No. 5\n"
        ]);

        assert.equal(result.isRunning, true, "Expected process to be running");
        assert(T.Number.is(result.pid) && result.pid > 0, "Should have a pid");

        await counter.kill();
    });

    it("executes an application, waits until it is ready, but exceeds given timeout", function(done) {
        const counter = process(`node ${counterScript}`, "Log No. 10");

        counter.ready(10)
            .then(() => done(new Error("should timeout")))
            .catch(err => {
                try {
                    assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

                    counter
                        .kill()
                        .then(() => done()) // eslint-disable-line
                        .catch(done);
                } catch(e) {
                    done(e);
                }
            });
    });

    it("executes an application and waits its death", async function() {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 10/);
        const result  = await counter.death();

        result.data
            .split("\n")
            .forEach(function(row, iterator) {
                assert(row === `Log No. ${iterator + 1}`, `Wrong output: ${row}, expected:\n Log No. ${iterator + 1}`);
            });
    });

    it("executes an application and waits its death with a spedified timeout", async function() {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 10/);
        const result  = await counter.death(500);

        result.data
            .split("\n")
            .forEach(function(row, iterator) {
                assert(row === `Log No. ${iterator + 1}`, `Wrong output: ${row}, expected:\n Log No. ${iterator + 1}`);
            });
    });

    it("executes an application, waits its death, but exceeds given timeout", function(done) {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 10/);

        counter
            .death(10)
            .then(() => done(new Error("Shouldn't resolve here")))
            .catch(err => {
                try {
                    assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

                    counter.kill()
                    .then(() => done()); // eslint-disable-line
                } catch(e) {
                    done(e);
                }
            });
    });

    it("executes an application and handles it as a stream", function(done) {
        const inputLogger = process(`node ${stdinLogger}`, "");
        const writable    = Writable();
        const stream      = inputLogger.stream();

        writable.write = function(chunk) {
            assert.equal(chunk, "Hello\n");
            inputLogger.kill().then(() => done()).catch(done);
        };

        stream.pipe(writable);
        stream.write("Hello");
    });

    it("executes an application, but terminates unexpectedly", function(done) {
        const failProcess = process(`node ${failScript}`);

        failProcess.death(1000)
            .then(() => done(new Error("Shouldn't resolve here")))
            .catch(err => {
                try {
                    assert.equal(err.message, "Process was closed unexpectedly. Code: 1", "Message should be closing code with 1");
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it("executes an application, awaits its death and terminates with valid exit code", async function() {
        const validExitCodeProcess = process(`node ${exitCodeScript}`);
        const result               = await validExitCodeProcess.death(1000, 128);

        assert.equal(result.data, "Process exited with code 100");
    });

    it("executes an application and kills it", function(done) {
        const liveProcess = process(`node ${killScript}`, /Kill me/);

        liveProcess.ready(1000)
            .then(() => liveProcess.death())
            .then(() => done(new Error("shouldn trigger")))
            .catch(err => {
                try {
                    assert.equal(err.message, "Process was closed unexpectedly. Code: 137");
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });

    it("executes an application, kills it and terminates with valid exit code", async function() {
        const liveProcess = process(`node ${killScript}`, /Kill me/);

        await liveProcess.ready(1000);

        const result = await liveProcess.kill([137]);

        assert.equal(result.data, "Kill me");
    });
});
