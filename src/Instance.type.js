import T from "@circle/core-types";
import Result from "./Result.type";

/**
 * @typedef Instance
 *
 * @param  {*}       x to be evaluated
 * @return {Boolean}
 */
export default T.subtype(T.Object, function(x) {
    return (
        T.Boolean.is(x.isRunning) &&
        T.Boolean.is(x.fulfilled) &&
        T.Array.is(x.output) &&
        (Result.is(x.lastMatch) || T.Nil.is(x.lastMatch))
    );
}, "Instance");
