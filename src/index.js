import Process from "./Process";

/**
 * Creates a new Process
 *
 * @param  {String}     command   to be executed
 * @param  {Condition?} condition as filter
 * @return {Process}
 */
export default (command, condition = "") => Process.create(command, condition);
