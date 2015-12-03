/*
 * This file is part of CoreWorker.
 *
 * CoreWorker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CoreWorker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with CoreWorker.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 */

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
