/*
 * Runs a Script that listens on stdin and logs it
 * This example will return a stream
 */

import path from "path";
import fs from "fs";
import { Writable } from "stream";
import { process } from "../index";

const dummyfile   = path.join(__dirname, "Resources/dummyfile");
const writeStream = new Writable();

/** Creates a Process and waits for further action, before the process gets started
 *
 * @param  {String}    command   to execute
 * @param  {Condition} condition checking when process is ready
 * @return {Process}
 */
const grep    = process("grep first", "");
const stream  = grep.stream();

writeStream.write = function(output) {
    console.log("> Found the following matches in file:\n", output.slice(0, -1));

    console.log("> Closing..");
    grep.kill();
};

fs.createReadStream(dummyfile).pipe(stream).pipe(writeStream);
