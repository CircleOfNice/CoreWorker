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

import T from "@circle/core-types";
import RegExp from "./RegExp.type";

/**
 * @typedef Condition
 */
const Condition = T.union([RegExp, T.String, T.Function], "Condition");

Condition.dispatch = function(x) {
    if(RegExp.is(x))     return RegExp;
    if(T.String.is(x))   return T.String;
    if(T.Function.is(x)) return T.Function;

    throw new TypeError(`Cannot dispatch Condition: ${x}`);
};

export default Condition;
