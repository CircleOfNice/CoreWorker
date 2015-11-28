import Validator from "./Validator";
import NodeProcess from "./NodeProcess.type";
import Condition from "./Condition.type";
import T from "@circle/core-types";
import { spawn } from "child_process";
import { assign, first } from "lodash";
import { EventEmitter } from "events";
import Result from "./Result.type";

/**
 * Collects data and emits it afterwards
 *
 * @param  {String}   data received from process.output
 * @return {Boolean?}
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
 */
NodeProcess.prototype.run = T.func([], T.Nil, "NodeProcess.run").of(function() {
    if(this.isRunning()) return;

    const process = spawn(this.command, this.commandArgs);

    this.emitter.on("data", data => this.store(data.toString()));
    this.emitter.on("data", data => this.validate(data.toString()));
    process.stdout.on("data", data => this.emitter.emit("data", data.toString()));
    process.stderr.on("data", data => this.emitter.emit("data", `<error> ${data}`));
    process.on("close", () => this.emitter.emit("death", this.instance.output) && assign(this.instance, { isRunning: false }));

    assign(this.instance, process, {
        isRunning: true,
        kill:      process.kill
    });
});

/**
 * Streams data in process.stdin
 *
 * @param  {Buffer || String} chunk piped in stdin
 */
NodeProcess.prototype.write = T.func([T.Object], T.Nil, "nodeProcess.write").of(function(chunk) {
    this.instance.stdin.write(chunk);
});

/**
 * Flushs all data piped into stdin
 */
NodeProcess.prototype.end = T.func([], T.Nil, "nodeProcess.end").of(function() {
    this.instance.stdin.end();
});

/**
 * Kills a running instance
 *
 */
NodeProcess.prototype.kill = T.func([], T.Nil, "nodeProcess.kill").of(function() {
    if(!this.isRunning()) return;

    this.instance.kill();
});

/**
 * Sets a listener on Procces.close
 *
 * @param  {Function} cb executed after Process was closed
 */
NodeProcess.prototype.onDeath = T.func([T.Function], T.Nil, "nodeProcess.onDeath").of(function(cb) {
    this.emitter.on("death", cb);
});

/**
 * Sets a listener on Process.ready
 *
 * @param  {Function} cb executed, when process is ready
 */
NodeProcess.prototype.onReady = T.func([T.Function], T.Nil, "nodeProcess.onReady").of(function(cb) {
    this.emitter.on("ready", cb);
});

/**
 * Sets a listener on Process.stdout/Process.stderr
 *
 * @param  {Function} cb executed on Output
 */
NodeProcess.prototype.onData = T.func([T.Function], T.Nil, "nodeProcess.onData").of(function(cb) {
    this.emitter.on("data", cb);
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
    const filter  = Validator.create(condition);
    const emitter = new EventEmitter();
    const splittedCommand = command.split(" ");

    return {
        emitter:     emitter,
        command:     first(splittedCommand),
        commandArgs: splittedCommand.slice(1),
        filter:      filter,
        instance:    {
            isRunning: false,
            output:    [],
            lastMatch: null,
            fulfilled: false
        }
    };
});

export default NodeProcess;
