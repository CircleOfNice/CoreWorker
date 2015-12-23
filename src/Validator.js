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

import T from "tcomb";
import Validator from "./Validator.type";
import RegExp from "./RegExp.type";
import Condition from "./Condition.type";
import { assign, first } from "lodash";
import Result from "./Result";

/**
 * Returns matched String
 *
 * @param  {String} data containing matched String
 * @return {Result}
 */
Validator.prototype.getResult = T.func([T.String], Result, "validator.getResult").of(function(match) {
    return Result.create(RegExp.is(this.filter) ? first(this.filter.exec(match)) : null);
});

/**
 * Creates a new Validator with given condition
 *
 * @param  {*}         condition for validation
 * @return {Validator}
 */
Validator.create = T.func([Condition], Validator, "Validator.create").of(function(condition) {
    const validator = { filter: condition };

    if(RegExp.is(condition))   return assign(validator, { validate: value => condition.test(value) });
    if(T.String.is(condition)) return assign(validator, { validate: value => value.indexOf(condition) !== -1 });

    return assign(validator, { validate: condition });
});

export default Validator;
