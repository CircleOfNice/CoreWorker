import sinon from "sinon";
import assert from "assert";
import { keys, assign, set } from "lodash";
import { EventEmitter } from "events";
import T from "@circle/core-types";
import NodeProcess from "../NodeProcess";

const commandSpy   = sinon.spy();
const callbacks    = {};
const setCallbacks = (name, cb) => set(callbacks, name, cb);

const exec = function(command) {
    commandSpy(command);

    return {
        stdout: {
            on: (name, cb) => setCallbacks("stdout", cb)
        },
        stderr: {
            on: (name, cb) => setCallbacks("stderr", cb)
        },
        on:   setCallbacks,
        kill: () => callbacks.close(0)
    };
};

const run = T.func([], T.Nil, "NodeProcess.run").of(function() {
    if(this.isRunning()) return;

    const process = exec(this.command);

    this.emitter.on("data", data => this.store(data));
    this.emitter.on("data", data => this.validate(data));
    process.stdout.on("data", data => this.emitter.emit("data", data));
    process.stderr.on("data", data => this.emitter.emit("data", `<error> ${data}`));
    process.on("close", () => this.emitter.emit("death", this.instance.output) && assign(this.instance, { isRunning: false }));

    assign(this.instance, process, {
        isRunning: true,
        kill:      process.kill
    });
});

describe("NodeProcess", function() {
    before(function() {
        sinon.stub(NodeProcess.prototype, "run", run);
    });

    after(function() {
        NodeProcess.prototype.run.restore();
    });

    it("creates a new NodeProcess", function() {
        const nodeProcess = NodeProcess.create("node Test.js", "Started Successfully.");

        assert.deepStrictEqual(keys(nodeProcess.instance), ["isRunning", "output", "lastMatch", "fulfilled"], "No Instance of child_process should be set");
        assert(!nodeProcess.instance.isRunning, "Process shouldn't run after create");
        assert.equal(nodeProcess.command, "node Test.js", "Command should be stored in Process");
        assert(nodeProcess.filter.validate("Started Successfully."), "Filter should be set on given String");
        assert(nodeProcess.emitter instanceof EventEmitter, "emitter should be an instance of EventEmitter");
    });

    it("starts a nodeProcess and waits until it is ready(stdout)", function() {
        const nodeProcess = NodeProcess.create("node Test.js", "Started Successfully.");
        const matchSpy    = sinon.spy();

        nodeProcess.onReady(match => matchSpy(match));
        nodeProcess.run();

        assert(commandSpy.calledWith("node Test.js"), `commandSpy was called with wrong args: \n ${commandSpy.lastCall.args}`);
        assert.deepStrictEqual(keys(callbacks), ["stdout", "stderr", "close"], "Callbacks should be set after process.run");

        callbacks.stdout("Started Successfully.");
        assert(matchSpy.calledOnce, "matchSpy wasn't called once");
    });

    it("starts a nodeProcess and waits until it is ready(stderr)", function() {
        callbacks.stderr  = null;
        const nodeProcess = NodeProcess.create("node Test.js", "Huge Mistake");
        const matchSpy    = sinon.spy();

        nodeProcess.onReady(match => matchSpy(match));
        nodeProcess.run();

        assert(T.Function.is(callbacks.stderr), "Stderr should be set again");

        callbacks.stderr("Huge Mistake");

        assert(matchSpy.calledOnce, "matchSpy wasn't called once");
    });

    it("starts a process and waits until it is closed", function() {
        callbacks.close   = null;
        const nodeProcess = NodeProcess.create("node Test.js", "Not necessary");
        const closeSpy    = sinon.spy();

        nodeProcess.onDeath(output => closeSpy(output));
        nodeProcess.run();

        assert(T.Function.is(callbacks.close), "Close shoud be set again");
        callbacks.stdout("Yes");

        nodeProcess.kill("SIGTERM");
        assert(closeSpy.calledWith(["Yes"]), `closeSpy was called with wrong args: \n ${closeSpy.lastCall.args}`);
    });
});
