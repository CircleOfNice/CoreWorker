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

import T from "tcomb";
import Result from "./Result.type";

/**
 * @typedef Instance
 *
 * @param  {*}       x to be evaluated
 * @return {Boolean}
 */
export default T.refinement(T.Object, function(x) {
    return (
        T.Boolean.is(x.isRunning) &&
        T.Boolean.is(x.fulfilled) &&
        T.Boolean.is(x.isStreaming) &&
        T.Array.is(x.output) &&
        (Result.is(x.lastMatch) || T.Nil.is(x.lastMatch))
    );
}, "Instance");
