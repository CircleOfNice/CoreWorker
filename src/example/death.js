/* Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 *
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
 */

/*
 * Runs a Script that increases a counter each millisecond and logs it
 * This example waits until Process is finished
 */
import path from "path";
import { process } from "../index";

/** Creates a Process and waits for further action, before the process gets started
 *
 * @param  {String}    command   to execute
 * @param  {Condition} condition checking when process is ready
 * @return {Process}
 */
const copyProcess   = process(`cp ${path.join(__dirname, "Resources/dummyfile")} ${path.join(__dirname, "Resources/copiedDummyfile")}`);
const removeProcess = process(`rm ${path.join(__dirname, "Resources/copiedDummyfile")}`);

const copyAndRemove = async function() {
    /*eslint-disable*/
    try {
    /*eslint-enable*/
        console.log("> Copy file: dummyfile");
        await copyProcess.death(500);
        console.log("> Finished copy process: dummyfile -> copiedDummyfile");

        console.log("> Remove file: copiedDummyfile");
        await removeProcess.death(500);
        console.log("> Finished remove process: copiedDummyfile -> -");
    } catch(err) {
        console.log("Failed to copy or remove a single file: \n", err.message);
    }
};

copyAndRemove();
