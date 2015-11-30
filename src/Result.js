import T from "@circle/core-types";
import Result from "./Result.type";

/**
 * Creates a new Result
 *
 * @param  {String?} match stored in result
 * @return {Result}
 */
Result.create = T.func([T.maybe(T.String)], Result, "Result.create").of(function(match) {
    return {
        data: match
    };
});

export default Result;
