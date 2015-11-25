import T from "@circle/core-types";
import Validator from "./Validator.type";
import Instance from "./Instance.type";

/**
 * @typedef NodeProcess
 */
export default T.struct({
    emitter:  T.Object,
    instance: Instance,
    filter:   Validator,
    command:  T.String
}, "NodeProcess");
