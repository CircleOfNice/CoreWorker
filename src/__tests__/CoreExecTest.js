import CoreExec from "../Process";
import assert from "assert";
import Result from "../Result.type";
import { Writable } from "stream";
import path from "path";

const counterScript = path.join(__dirname, "/Scripts/CounterScript.js");
const stdinLogger   = path.join(__dirname, "/Scripts/StdinLogger.js");

describe("CoreExec", function() {
    it("executes an application and wait until it is ready", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, "Log No. 10");

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await process.ready(500);

            assert.deepStrictEqual(result, Result({ data: null }), "Result should contain null");
            process.kill();
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application and wait until it is ready", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, /Log\ No\.\ 5/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await process.ready(500);

            assert.deepStrictEqual(result, Result({ data: "Log No. 5" }), "Result should contain 'Log No. 5'");

            // process.kill();
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application and wait until it is ready exceeding timeout", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, "Log No. 10");

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await process.ready(10);

            assert.deepStrictEqual(result, Result({ data: null }), "Result should contain null");
            done(new Error("This shouldn't finish."));
        } catch(err) {
            assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

            process.kill();
            done();
        }
    });

    it("executes an application and wait until death", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await process.death();

            result.data.split("\n").filter(line => line !== "").forEach(row => assert(row.indexOf("Log No.") === 0, `Wrong output: ${row}`));
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application and wait until death with timeout", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const result = await process.death(500);

            result.data.split("\n").filter(line => line !== "").forEach(row => assert(row.indexOf("Log No.") === 0, `Wrong output: ${row}`));
            done();
        } catch(err) {
            done(err);
        }
    });

    it("executes an application and wait until death exceeding timeout", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            await process.death(10);
            done(new Error("Shouldn't resolve here"));
        } catch(err) {
            assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

            process.kill();
            done();
        }
    });

    it("executes an application and handles it as a stream", function(done) {
        const process  = CoreExec.create(`node ${stdinLogger}`, "");
        const writable = Writable();
        const stream   = process.stream();

        writable.write = function(chunk) {
            assert.equal(chunk, "Hello\n");
            process.kill();
            done();
        };

        stream.pipe(writable);
        stream.write("Hello");
    });
});
