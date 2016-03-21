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
 * Copyright 2016 TeeAge-Beatz UG (haftungsbeschränkt)
 */

/*
 * Runs a Script that increases a counter each millisecond and logs it
 * This example waits until Process is ready
 */
import path from "path";
import { process } from "../index";

const websocketPath   = path.join(__dirname, "Resources/Websocket");
const websocket       = process(`node ${websocketPath}`, "Request was upgraded successfully to new Websocket");
const createWebsocket = async function() {
    /* eslint-disable */
    try {
    /* eslint-enable */
        console.log("> Creating a websocket");
        const result = await websocket.ready(1000);

        /*
         * If Promise gets resolved, a Result is returned containing ...
         *
         * condition === Regex                            --> { data: MatchedString }
         * condition === String || condition === Function --> { data: null }
         */
        console.log("> Websocket is ready to use, returning the following result: \n", result);
        console.log("> Shutdown process...");

        websocket.kill();
    } catch(err) {
        console.log("Failed to create Websocket", err.message);
        websocket.kill();
    }
};

createWebsocket();
