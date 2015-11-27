/* eslint no-var: 0 lines-around-comment: 0*/

/*
 * Runs a Script that listens on stdin and logs it
 * This example will return a stream
 */

var path        = require("path");
var CoreExec    = require("../index");
var stdinLogger = path.join(__dirname, "../build/src/__tests__/Scripts/StdinLogger.js");
var Writable    = require("stream").Writable;
var writeStream = new Writable();

/** Creates a Process with
 *
 * @param  {String}                      command   to execute
 * @param  {String || Function || Regex} condition checking when process is ready
 * @return {Process}                     --> Not running yet
 */
var process = CoreExec.create(`node ${stdinLogger}`, "");
var stream  = process.stream();

writeStream.write = function(output) {
    console.log("> Got Output", output.slice(0, -1));

    console.log("> Closing..");
    process.kill();
};

stream.pipe(writeStream);
stream.write("Hello World");
