import T from "@circle/core-types";

/**
 * @typedef Result
 */
export default T.struct({
    data: T.maybe(T.String)
}, "Result");
