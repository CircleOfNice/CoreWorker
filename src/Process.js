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

import Q from "q";
import Process from "./Process.type";
import NodeProcess from "./NodeProcess";
import DuplexStream from "./DuplexStream";
import TDuplexStream from "./DuplexStream.type";
import defaults from "set-default-value";
import T from "tcomb";
import Condition from "./Condition.type";
import assert from "assert";
import ExitCodes from "./ExitCodes";
import MaybeExitCodes from "./MaybeExitCodes.type";

/**
 * Awaits the death of a (running) process
 *
 * @param  {Index?}         maybeTimeout   until process should have died
 * @param  {MaybeExitCodes} maybeExitCodes that are valid
 * @return {Promise}
 */
Process.prototype.death = function(maybeTimeout, maybeExitCodes) {
    const timeout   = T.Number(defaults(maybeTimeout).to(0));
    const exitCodes = ExitCodes.create(maybeExitCodes);
    const deferred  = Q.defer();

    this.instance.onDeath(deferred, exitCodes);
    this.instance.onTimeout(deferred);
    this.instance.run(timeout);

    return deferred.promise;
};

/**
 * Awaits the initialized process
 *
 * @param  {Index}   timeout until instance should be ready
 * @return {Promise}
 */
Process.prototype.ready = T.func([T.Number], T.Object, "process.ready").of(function(timeout) {
    if(this.instance.isRunning() && this.instance.isReady()) return this.instance.lastMatch();

    const deferred = Q.defer();

    this.instance.onReady(deferred.resolve);
    this.instance.onTimeout(deferred);
    this.instance.run(timeout);

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
 * @param {MaybeExitCodes} maybeExitCodes that are valid
 */
Process.prototype.kill = T.func([MaybeExitCodes], T.Object, "process.kill").of(function(maybeExitCodes) {
    const exitCodes = ExitCodes.create(maybeExitCodes);

    return this.instance.kill(exitCodes);
});

/**
 * Creates a new Process
 *
 * @param  {String}    command   executed in Process
 * @param  {Condition} condition as filter
 * @return {Process}
 */
Process.create = function(command, condition = "") {
    return Process({
        instance: NodeProcess.create(T.String(command), Condition(condition))
    });
};

export default Process;
