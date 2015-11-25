import T from "@circle/core-types";
import RegEx from "./RegEx.type";

/**
 * @typedef Condition
 */
const Condition = T.union([RegEx, T.String, T.Function], "Condition");

Condition.dispatch = function(x) {
    if(RegEx.is(x))      return RegEx;
    if(T.String.is(x))   return T.String;
    if(T.Function.is(x)) return T.Function;

    throw new TypeError(`Cannot dispatch Condition: ${x}`);
};

export default Condition;
