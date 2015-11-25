import CoreExec from "../index";
import assert from "assert";
import Result from "../Result.type";
import { Writable } from "stream";
import path from "path";

describe("CoreExec", function() {
    const counterScript = path.join(__dirname, "/Scripts/CounterScript.js");
    const stdinLogger   = path.join(__dirname, "/Scripts/StdinLogger.js");

    it("executes an application and wait until it is ready", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, "Log No. 10");

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            await process.ready(500);

            process.kill("SIGTERM");
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

            assert.deepStrictEqual(result, Result({ data: "Log No. 5" }));

            process.kill("SIGTERM");
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
            await process.ready(10);

            done(new Error("This shouldn't finish."));
        } catch(err) {
            assert.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

            process.kill("SIGTERM");
            done();
        }
    });

    it("executes an application and wait until death", async function(done) {
        const process = CoreExec.create(`node ${counterScript}`, /Log\ No\.\ 10/);

        /*eslint-disable*/
        try {
        /*eslint-enable*/
            const output = await process.death();

            output.forEach(row => assert(row.indexOf("Log No.") === 0, `Wrong output: ${row}`));
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
            const output = await process.death(500);

            output.forEach(row => assert(row.indexOf("Log No.") === 0, `Wrong output: ${row}`));
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

            process.kill("SIGTERM");
            done();
        }
    });

    it("executes an application and handles it as a stream", function(done) {
        const process  = CoreExec.create(`node ${stdinLogger}`, "");
        const writable = Writable();
        const stream   = process.stream();

        writable.write = function(chunk) {
            assert.equal(chunk, "Hello\n");
            process.kill("SIGTERM");
            done();
        };

        stream.pipe(writable);
        stream.write("Hello");
    });
});
