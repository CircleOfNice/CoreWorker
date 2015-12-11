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

import { process } from "../index";
import assert from "assert";
import Result from "../Result.type";
import { Writable } from "stream";
import path from "path";

const counterScript = path.join(__dirname, "/Scripts/CounterScript.js");
const stdinLogger   = path.join(__dirname, "/Scripts/StdinLogger.js");
const failScript    = path.join(__dirname, "/Scripts/FailScript.js");

describe("CoreExec", function() {
    it("executes an application and waits until it is ready", async function(done) {
        const counter = process(`node ${counterScript}`, "Log No. 10");

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await counter.ready(500);

            assert.deepStrictEqual(result, Result({ data: null }), "Result should contain null");
            counter.kill();
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application and waits until it is ready", async function(done) {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 5/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await counter.ready(500);

            assert.deepStrictEqual(result, Result({ data: "Log No. 5" }), "Result should contain 'Log No. 5'");

            counter.kill();
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application, waits until it is ready, but exceeds given timeout", async function(done) {
        const counter = process(`node ${counterScript}`, "Log No. 10");

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await counter.ready(10);

            assert.deepStrictEqual(result, Result({ data: null }), "Result should contain null");
            done(new Error("This shouldn't finish."));
        } catch(err) {
            assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

            counter.kill();
            done();
        }
    });

    it("executes an application and waits its death", async function(done) {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await counter.death();

            result.data
                .slice(0, -1)
                .split("\n")
                .forEach(function(row, iterator) {
                    assert(row === `Log No. ${iterator + 1}`, `Wrong output: ${row}, expected:\n Log No. ${iterator + 1}`);
                });
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application and waits its death with a spedified timeout", async function(done) {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await counter.death(500);

            result.data
                .slice(0, -1)
                .split("\n")
                .forEach(function(row, iterator) {
                    assert(row === `Log No. ${iterator + 1}`, `Wrong output: ${row}, expected:\n Log No. ${iterator + 1}`);
                });
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application, waits its death, but exceeds given timeout", async function(done) {
        const counter = process(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            await counter.death(10);
            done(new Error("Shouldn't resolve here"));
        } catch(err) {
            assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

            counter.kill();
            done();
        }
    });

    it("executes an application and handles it as a stream", function(done) {
        const inputLogger = process(`node ${stdinLogger}`, "");
        const writable    = Writable();
        const stream      = inputLogger.stream();

        writable.write = function(chunk) {
            assert.equal(chunk, "Hello\n");
            inputLogger.kill();
            done();
        };

        stream.pipe(writable);
        stream.write("Hello");
    });

    it("executes an application, but terminates unexpectedly", async function(done) {
        const failProcess = process(`node ${failScript}`);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            await failProcess.death(100);
            done(new Error("Shouldn't resolve here"));
        } catch(err) {
            assert.equal(err.message, "Process was closed unexpectedly. Code: 1", "Message should be closing code with 1");
            done();
        }
    });
});
