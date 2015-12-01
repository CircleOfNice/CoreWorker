import T from "@circle/core-types";
import NodeProcess from "./NodeProcess.type";

/**
 * @typedef DuplexStream
 */
export default T.subtype(T.Object, function(x) {
    return NodeProcess.is(x.instance);
}, "DuplexStream");
