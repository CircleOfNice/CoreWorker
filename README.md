# Motivation
Handle child processes in node.js leads to a lot of boilerplate, even though the handling is only a mean of running your main tasks correctly. Therefore CoreWorker tries to eliminate this overhead by offering you addtional features. In fact it is an abstraction of node's <a href="https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options">spawn</a>-command, that allows you to manage special lifecycle events of your child process. 
This means that you get the abillity to define a "ready"- and/or "finished"-state and determine a given reaction to those state changes. Thus CoreWorker facilitates building preconditions for other processes or even lets you exchange information between your main process and relating child processes - like in a [duplex stream](#use-process-as-stream).

# Installation

You may install CoreWorker with npm 
```js
npm install core-worker
``` 

## API
You may use CoreWorker on two different ways. Either you import ```{ process }```, which is a method to create new Processes, or you import ```{ Process }``` to create your Processes manually.
```js
typedef CoreWorker : {
    process: process,
    Process: Process
}
```
With process in lower case, you have to pass a ```command``` and an optional ```filter``` to get a new Process-Instance, whereas a command has to use absolute pathes and should look like on your os specific command line interface.
```
typedef process: Command -> Filter? -> Process
typedef Filter:  Nil | String | String -> Boolean | RegExp
typdef Command:  String
```
If you want to import capitalized Process, you just have to use ```Process.create``` for creating new instances of Process.
```js
typedef create: Command -> Filter? -> Process
```
However, when you got your instance, you have multiple possibilites for interaction. You may want to await, the process getting ready or finished, or you want to use your process for streaming functionalities. Additionally it is always possible to kill your instance with ```instance.kill()```.
```
typedef Process: {
    ready:  Timeout  -> Result
    death:  Timeout? -> Result
    stream: Nil      -> Stream
    kill:   Nil      -> Nil
}
typedef Timeout: Index
```
Using ```instance.ready``` or ```instance.death``` will return a Promise object, that either gets fullfilled with a result or rejected with an error. If you set a RegExp as filter, the result will contain the mathced string - otherwise it contains ```Nil```.
```
typedef Result:  {
    data: String | Nil
}
```
Using ```instance.stream``` returns a duplex stream directly, with whom you can write in the stdin of your instance. All output generated in stdout/stderr of your instance can be piped into another writable stream.
```
typdef Stream: {
    write: String | Buffer -> Nil
    pipe:  Stream          -> Nil
}
```

# Usage
It starts a process and waits until a log (of stdout/stderr) contains "filter condition"
```js
import { process } from "core-worker";

const result = await process("your command", "filter condition").ready(1000);
```
It starts a process and wait until it is finished
```js
import { process } from "core-worker";

const result = await process("your command").death();
```
Start a process and use it as a stream
```js
import { process } from "core-worker";

readstream.pipe(process("your command").stream()).pipe(writestream);
```
# Examples

## Wait until process is ready
Let's suppose we want to wait until our http-server is ready - but not longer than 1000 milliseconds
So first we write a simple server script ...
```js
//Server.js
const server = http.createServer(...);

server.listen(1337, "127.0.0.1", function() {
    // This log will notify our main process, that the server is ready to use
    console.log("Server is ready.");
});
```
... and finally execute it with CoreWorker:
```js
//startServer.js
import { process } from "core-worker";

try {
    /*
     * For this child process we set the filter "Server is ready" and a timeout of 1000 milliseconds.
     * Accordingly, the process gets ready, when a log contains this string within the given timeout.
     */
    const result = await process("node Server.js", "Server is ready.").ready(1000);
    
    console.log(result);
} catch(err) {
    // handle err
}
```
This example runs "Server.js" in a child process and returns a promise. That's why "Server.js" logs its ready status after ther server has started successfully and "startServer.js" validates stdout/stderr for this log resolving the returned promise with a result. The result will be null, if your filter is of type ```String | Function```. If the filter is of type ```RegExp```, the result returns the matched string. If the timeout of 1000 milliseconds exceeds before a result is returned, the process throws an Error instead.

## Wait until process has finished
If you rather want to wait until a process is finished, you can achieve this with the following exmaple:
This time we want to copy a given file, named "/path/to/file" with the "cp"-command into a new location "/newLocation/copiedFile".

```js
import { process } from "core-worker";

try {
    const result = await process("cp path/to/file /newLocation/newFile").death();
    
    console.log(err);
} catch(err) {
    // handle err
}
```
For this example the timeout isn't really necessary since we think this time it's really acceptable to wait until the end of days for our copy operation to finish. So Process.death allows you to omit this parameter, even though this isn't recommmended and in Process.ready forbidden.

## Use process as stream
This examples shows you the possibility to compose single process like on a unix shell, but instead of using the pipe operator "|" (e.g. cat file.txt | grep something), you can use Process.stream:

So lets assume that we want to read a file, ...
```
It is a period of civil war. Rebel spaceships, striking from a hidden base,
have won their first victory against the evil Galactic Empire.
During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon,
the DEATH STAR, an armored space station with enough power to destroy an entire planet.
Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, 
custodian of the stolen plans that can save her people and restore freedom to the galaxy . . .
```
... grep for "galaxy" with our process and use the output for other operations:
```js
import { process } from "CoreWorker";
import fs from "fs";

fs.createReadStream(file).pipe(process("grep galaxy").stream()).pipe(other operation);
```
By using the stream method you have the possibility to include the process in a chain of streams. This means that data can be written in your waiting command and piped out into your next stream afterwards.

## Use all process functions at once
If you want to use the complete functionality of process at once, you have to start it with a stream first.
In this exmaple we want to start a chat application, that logs "Chat ready", when it accepts messages.
```js
import { process } from "core-worker";

const simpleChat = process("node chat.js", "Chat ready");
const chatInput  = process.stream();
try {
    simpleChat
        .death()
        .then(() => console.log("Chat closed"))
        .catch(err => throw err);

    await simpleChat.ready(500);
    
    chatInput.pipe(console.log);
    chatInput.write("Hello");
    chatIntput.write("Goodbye");
    
    simpleChat.kill();
} catch(err) {
    // handle err
}
```

# Testing

You may test CoreWorker with mocha by executing ```make test``` in the root directory of the project.

# Contributing

If you want to contribute to this repository, please ensure ...
    ... to use ```make``` for deployment (it validates the source code and transpiles it in /lib).
    ... to follow the existing coding style.
    ... to use the linting tools that are listed in the package.json,  which should validate anyway by using ```make```.
    ... to add and/or customize unit tests for any changed code.
    ... to reference an issue in your pull request with a small description of your changes.
