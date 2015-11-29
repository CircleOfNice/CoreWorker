/*
 * Runs a Script that increases a counter each millisecond and logs it
 * This example waits until Process is ready
 */
import path from "path";
import CoreExec from "../index";

const websocket = path.join(__dirname, "Resources/Websocket");

/** Creates a Process with
 *
 * @param  {String}                      command   to execute
 * @param  {String || Function || Regex} condition checking when process is ready
 * @return {Process}                     --> Not running yet
 */
const process         = CoreExec.create(`node ${websocket}`, "Request was upgraded successfully to new Websocket");
const createWebsocket = async function() {
    /*eslint-disable*/
    try {
    /*eslint-enabe*/
        console.log("> Creating a websocket");
        const result = await process.ready(1000);

        /*
         * If Promise gets resolved, a Result is returned containing ...
         *
         * condition === Regex                            --> { data: MatchedString }
         * condition === String || condition === Function --> { data: null }
         */
        console.log("> Websocket is ready to use, returning the following result: \n", result);
        console.log("> Shutdown process...");

        process.kill();
    } catch(err) {
        console.log("Failed to create Websocket", err.message);
        process.kill();
    }
};

createWebsocket();
