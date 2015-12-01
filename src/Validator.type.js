import T from "@circle/core-types";
import Condition from "./Condition.type";

/**
 * @typedef Validator
 */
export default T.struct({
    filter:   Condition,
    validate: T.func([T.String], T.Boolean, "validate")
}, "Validator");
