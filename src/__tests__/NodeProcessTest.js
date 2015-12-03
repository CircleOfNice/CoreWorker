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

import sinon from "sinon";
import assert from "assert";
import { keys, set } from "lodash";
import { EventEmitter } from "events";
import T from "@circle/core-types";
import NodeProcess from "../NodeProcess";
import Result from "../Result";
import ChildProcess from "child_process";

const commandSpy   = sinon.spy();
const callbacks    = {};
const setCallbacks = (name, cb) => set(callbacks, name, cb);

const spawn = function(command, commandArgs) {
    commandSpy(command, commandArgs);

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

describe("NodeProcess", function() {
    before(function() {
        sinon.stub(ChildProcess, "spawn", spawn);
    });

    after(function() {
        ChildProcess.spawn.restore();
    });

    it("creates a new nodeProcess", function() {
        const nodeProcess = NodeProcess.create("node Test.js", "Started Successfully.");

        assert.deepStrictEqual(keys(nodeProcess.instance), ["isRunning", "output", "lastMatch", "fulfilled"], "No Instance of child_process should be set");
        assert(!nodeProcess.instance.isRunning, "Process shouldn't run after create");
        assert.equal(nodeProcess.command, "node", "Command should be stored in Process");
        assert.equal(nodeProcess.commandArgs, "Test.js", "CommandArgs should be stored in Process");
        assert(nodeProcess.filter.validate("Started Successfully."), "Filter should be set on given String");
        assert(nodeProcess.emitter instanceof EventEmitter, "emitter should be an instance of EventEmitter");
    });

    it("starts a nodeProcess and waits until it is ready(stdout)", function() {
        const nodeProcess = NodeProcess.create("node Test.js", "Started Successfully.");
        const matchSpy    = sinon.spy();

        nodeProcess.onReady(match => matchSpy(match));
        nodeProcess.run();

        assert(commandSpy.calledWith("node", ["Test.js"]), `commandSpy was called with wrong args: \n ${commandSpy.lastCall.args}`);
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

    it("starts a nodeProcess and waits until it is closed", function() {
        callbacks.close   = null;
        const nodeProcess = NodeProcess.create("node Test.js", "Not necessary");
        const closeSpy    = sinon.spy();

        nodeProcess.onDeath(output => closeSpy(output));
        nodeProcess.run();

        assert(T.Function.is(callbacks.close), "Close shoud be set again");
        callbacks.stdout("Yes");

        callbacks.close();
        assert(closeSpy.calledWith(Result({ data: "Yes" })), `closeSpy was called with wrong args: \n ${closeSpy.lastCall.args}`);
    });
});
