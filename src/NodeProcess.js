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

import Validator from "./Validator";
import NodeProcess from "./NodeProcess.type";
import Condition from "./Condition.type";
import T from "tcomb";
import { spawn } from "child_process";
import { assign, first, last } from "lodash";
import { EventEmitter } from "events";
import Result from "./Result";
import NotNil from "./NotNil.type";
import TimeoutError from "./TimeoutError";
import defaults from "set-default-value";

/**
 * Collects data and emits it afterwards
 *
 * @param  {String}   data received from process.output
 */
NodeProcess.prototype.validate = T.func([T.String], T.Nil, "nodeProcess.validate").of(function(data) {
    if(Result.is(this.instance.result) || !this.filter.validate(data)) return;

    const result = this.filter.getResult(data);

    assign(this.instance, {
        result:    result,
        fulfilled: true
    });

    this.emitter.emit("ready", result);
});

/**
 * Stores new output
 *
 * @param  {String} data to be stored
 */
NodeProcess.prototype.store = T.func([T.String], T.Nil, "nodeProcess.store").of(function(data) {
    assign(this.instance, {
        output: this.instance.output.concat([data])
    });
});

/**
 * Starts the Process of current instance
 *
 * @param {Index?} maybeTimeout after that a timeout event gets emitted
 */
NodeProcess.prototype.run = function(maybeTimeout) {
    if(this.isRunning()) return;

    const process = spawn(this.command, this.commandArgs);
    const timeout = defaults(maybeTimeout).to(0);

    this.emitter.on("data", data => this.store(data.toString()));
    this.emitter.on("data", data => this.validate(data.toString()));
    process.stdout.on("data", data => this.emitter.emit("data", data.toString()));
    process.stderr.on("data", data => this.emitter.emit("data", `<error> ${data}`));
    process.on("close", (code, signal) => code === 0 || NotNil.is(signal) ? ::this.finish() : ::this.terminate(code));

    assign(this.instance, process, {
        isRunning: true,
        kill:      process.kill
    });
    setTimeout(() => timeout > 0 ? this.emitter.emit("timeout") : null, timeout);
};

/**
 * Streams data in process.stdin
 *
 * @param  {Buffer} chunk piped in stdin
 */
NodeProcess.prototype.write = T.func([T.Object], T.Nil, "nodeProcess.write").of(function(chunk) {
    this.instance.stdin.write(chunk);
});

/**
 * Signals the instance, that it is streaming
 */
NodeProcess.prototype.startStream = T.func([], T.Nil, "nodeProcess.startStream").of(function() {
    assign(this.instance, {
        isStreaming: true
    });
});

/**
 * Flushs all data piped into stdin
 */
NodeProcess.prototype.end = T.func([], T.Nil, "nodeProcess.end").of(function() {
    assign(this.instance, {
        isStreaming: false
    });
    this.instance.stdin.end();
});

/**
 * Kills a running instance
 *
 * @return {Boolean}
 */
NodeProcess.prototype.kill = T.func([], T.Boolean, "nodeProcess.kill").of(function() {
    if(!this.isRunning()) return true;

    if(this.instance.isStreaming) this.instance.stdin.pause();
    return this.instance.kill();
});

/**
 * Emits an Error if process was closed unexpectedly
 *
 * @param {Index} code as exit status of the instance
 */
NodeProcess.prototype.terminate = T.func([T.Number], T.Nil, "nodeProcess.terminate").of(function(code) {
    assign(this.instance, { isRunning: false });
    this.emitter.emit("failure", new Error(`Process was closed unexpectedly. Code: ${code}`));
});

/**
 * Emits result after process was closed
 */
NodeProcess.prototype.finish = T.func([], T.Nil, "nodeProcess.finish").of(function() {
    assign(this.instance, { isRunning: false });
    this.emitter.emit("death", Result.create(this.instance.output.join("")));
});

/**
 * Stores a callback, that gets called, when process ends
 *
 * @param {Promise} deferred executed after Process was closed
 */
NodeProcess.prototype.onDeath = T.func([T.Object], T.Nil, "nodeProcess.onDeath").of(function(deferred) {
    this.emitter.on("death", deferred.resolve);
    this.emitter.on("failure", deferred.reject);
});

/**
 * Stores a callback, that gets called, when process is ready
 *
 * @param  {Function} cb executed, when process is ready
 */
NodeProcess.prototype.onReady = T.func([T.Function], T.Nil, "nodeProcess.onReady").of(function(cb) {
    this.emitter.on("ready", cb);
});

/**
 * Stores a callback, that gets called, when process logs in stdout/stderr
 *
 * @param  {Function} cb executed on Output
 */
NodeProcess.prototype.onData = T.func([T.Function], T.Nil, "nodeProcess.onData").of(function(cb) {
    this.emitter.on("data", cb);
});

/**
 * Stores a deferrable that will be rejected on an emitted timeout event
 *
 * @param {Promise} deferred to be rejected on timeout event
 */
NodeProcess.prototype.onTimeout = T.func([T.Object], T.Nil, "nodeProcess.onTimeout").of(function(deferred) {
    this.emitter.on("timeout", () => deferred.reject(TimeoutError.create(last(this.instance.output))));
});

/**
 * Returns current state of Process
 *
 * @return {Boolean}
 */
NodeProcess.prototype.isRunning = T.func([], T.Boolean, "nodeProcess.isRunning").of(function() {
    return this.instance.isRunning;
});

/**
 * Returns if process is ready
 *
 * @return {Boolean}
 */
NodeProcess.prototype.isReady = T.func([], T.Boolean, "nodeProcess.isReady").of(function() {
    return this.instance.fulfilled;
});

/**
 * Returns last match
 *
 * @return {String?}
 */
NodeProcess.prototype.lastMatch = T.func([], T.maybe(T.String), "nodeProcess.lastMatch").of(function() {
    return this.instance.lastMatch;
});

/**
 * Creates a new Instance of NodeProcess
 *
 * @param  {String}      command   which will be executed
 * @param  {Condition}   condition to filter logs
 * @return {NodeProcess}
 */
NodeProcess.create = T.func([T.String, Condition], NodeProcess, "NodeProcess.create").of(function(command, condition) {
    const filter          = Validator.create(condition);
    const emitter         = new EventEmitter();
    const splittedCommand = command.split(" ");

    return {
        emitter:     emitter,
        command:     first(splittedCommand),
        commandArgs: splittedCommand.slice(1),
        filter:      filter,
        instance:    {
            isRunning:   false,
            isStreaming: false,
            output:      [],
            lastMatch:   null,
            fulfilled:   false
        }
    };
});

export default NodeProcess;
