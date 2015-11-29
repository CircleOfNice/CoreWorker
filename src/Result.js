import T from "@circle/core-types";
import Result from "./Result.type";

/**
 * Creates a new Result containing the complete output of a process
 *
 * @param  {String[]} output stored in result
 * @return {Result}
 */
Result.createBatch = T.func([T.list(T.String)], Result, "Result.createBatch").of(function(output) {
    return {
        data: output.join("")
    };
});

/**
 * Creats a new Result
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
