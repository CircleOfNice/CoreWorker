/*
 * Runs a Script that increases a counter each millisecond and logs it
 * This example waits until Process is finished
 */
import path from "path";
import process from "../index";

/** Creates a Process with
 *
 * @param  {String}                      command   to execute
 * @param  {String || Function || Regex} condition checking when process is ready
 * @return {Process}                     --> Not running yet
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
