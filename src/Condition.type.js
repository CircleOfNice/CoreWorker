import T from "@circle/core-types";
import RegExp from "./RegExp.type";

/**
 * @typedef Condition
 */
const Condition = T.union([RegExp, T.String, T.Function], "Condition");

Condition.dispatch = function(x) {
    if(RegExp.is(x))      return RegExp;
    if(T.String.is(x))   return T.String;
    if(T.Function.is(x)) return T.Function;

    throw new TypeError(`Cannot dispatch Condition: ${x}`);
};

export default Condition;
