import Q from "q";
import Process from "./Process.type";
import NodeProcess from "./NodeProcess";
import DuplexStream from "./DuplexStream";
import TDuplexStream from "./DuplexStream.type";
import defaults from "set-default-value";
import T from "@circle/core-types";
import Condition from "./Condition.type";
import assert from "assert";

/**
 * Awaits the death of a (running) process
 *
 * @param  {Index?}  maybeTimeout until process should have died
 * @return {Promise}
 */
Process.prototype.death = function(maybeTimeout) {
    const timeout  = T.Index(defaults(maybeTimeout).to(0));
    const deferred = Q.defer();

    this.instance.onDeath(deferred.resolve);
    this.instance.run();
    setTimeout(() => timeout === 0 ? null : deferred.reject(new Error("Timeout exceeded.")), timeout);

    return deferred.promise;
};

/**
 * Awaits the initialized process
 *
 * @param  {Index}   timeout until instance should be ready
 * @return {Promise}
 */
Process.prototype.ready = T.func([T.Index], T.Object, "process.ready").of(function(timeout) {
    if(this.instance.isRunning() && this.instance.isReady()) return this.instance.lastMatch();

    const deferred = Q.defer();

    this.instance.onReady(deferred.resolve);
    this.instance.run();
    setTimeout(deferred.reject, timeout, new Error("Timeout exceeded."));

    return deferred.promise;
});

/**
 * Starts a new DuplexStream, listening on DataOutput of a new Process-Instance
 *
 * @return {DuplexStream}
 */
Process.prototype.stream = T.func([], TDuplexStream, "process.stream").of(function() {
    assert(!this.instance.isRunning(), "Can't use stream after process initialization");

    this.instance.run();

    return new DuplexStream(this.instance);
});

/**
 * Kills a running Process
 *
 * @param {String} signal to kill the process
 */
Process.prototype.kill = T.func([], T.Nil, "process.kill").of(function() {
    this.instance.kill();
});

/**
 * Returns global "process"-variable
 *
 * @return {Object}
 */
Process.prototype.getGlobal = T.func([], T.Object, "process.getGlobal").of(function() {
    return process;
});

/**
 * Creates a new Process
 *
 * @param  {String}    command   executed in Process
 * @param  {Condition} condition as filter
 * @return {Process}
 */
Process.create = T.func([T.String, Condition], Process, "Process.create").of(function(command, condition) {
    return {
        instance: NodeProcess.create(T.String(command), Condition(condition))
    };
});

export default Process;
