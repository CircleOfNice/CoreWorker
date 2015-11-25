import T from "@circle/core-types";
import Validator from "./Validator.type";
import RegEx from "./RegEx.type";
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
    return Result.create(RegEx.is(this.filter) ? first(this.filter.exec(match)) : null);
});

/**
 * Creates a new Validator with given condition
 *
 * @param  {*}         condition for validation
 * @return {Validator}
 */
Validator.create = T.func([Condition], Validator, "Validator.create").of(function(condition) {
    const validator = { filter: condition };

    if(RegEx.is(condition))      return assign(validator, { validate: value => condition.test(value) });
    if(T.String.is(condition))   return assign(validator, { validate: value => value.indexOf(condition) !== -1 });
    if(T.Function.is(condition)) return assign(validator, { validate: condition });
});

export default Validator;
