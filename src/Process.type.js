import T from "@circle/core-types";
import NodeProcess from "./NodeProcess";

/**
 * @typedef ProcessManager
 */
export default T.struct({
    instance: NodeProcess
}, "ProcessManager");
