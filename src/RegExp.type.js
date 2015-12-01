import T from "@circle/core-types";

/**
 * @typedef RegExp
 *
 * @param  {*}       x to be evaluated
 * @return {Boolean}
 */
export default T.subtype(T.Object, function(x) {
    return x instanceof RegExp;
}, "RegExp");
