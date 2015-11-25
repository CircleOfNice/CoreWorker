/* eslint no-var: 0 lines-around-comment: 0*/

/*
 * Runs a Script that increases a counter each millisecond and logs it
 * This example waits until Process is finished
 */

var path          = require("path");
var CoreExec      = require("../build/src/index");
var counterScript = path.join(__dirname, "../build/src/__tests__/Scripts/CounterScript.js");

/** Creates a Process with
 *
 * @param  {String}                      command   to execute
 * @param  {String || Function || Regex} condition checking when process is ready
 * @return {Process}                     --> Not running yet
 */
var process = CoreExec.create(`node ${counterScript}`, /[aA-zZ]+\ [aA-zZ]+\.\ 10/);

/**
 * Starts the Process and waits 500 Seconds to be finished
 *
 * @param  {Index}   timeout
 * @return {Promise}
 */
process.death(500).then(function(output) {
    /**
     * If Promise gets resolved, a Result is returned containing the complete output
     */
    console.log("Process is finished and produced the following output:\n", output);
}).catch(function(err) {
    /*
     * If the timeout exceeds, the promise gets rejected with an Error
     */
    console.log(err.message);
    process.kill("SIGTERM");
});
