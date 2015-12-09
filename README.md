# Motivation
Handle child processes in node.js leads to a lot of boilerplate, even though the handling is only a mean of running your main tasks correctly. Therefore CoreWorker tries to eliminate this overhead by offering you addtional features. In fact it is an abstraction of node's <a href="https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options">spawn</a>-command, that allows you to manage special lifecycle events of your child process. 
This means that you get the abillity to define a "ready"- and/or "finished"-state and determine a given reaction to those state changes. Thus CoreWorker facilitates building preconditions for other processes or even lets you exchange information between your main process and relating child processes - like in a [duplex stream](#use-process-as-stream).

# Installation

You may install CoreWorker with npm 
```js
npm install core-worker
``` 

## API
By default you can import CoreWorker with ```{ process }```, which is a method, that allows you to create new process instances.
By using process, you have to pass a ```command``` and an optional ```filter``` to get a new Process-Instance, whereas a command has to use absolute paths and should look like on your os specific command line interface.
```
typedef process: Command -> Filter? -> Process
typedef Filter:  Nil | String | String -> Boolean | RegExp
typdef Command:  String
```
Now you are able to interact with the returned instance in multiple ways: You can for example wait until the process is ready or dead or use it as a stream.  Additionally it is always possible to kill your instance with ```instance.kill()```.
```
typedef Process: {
    ready:  Timeout  -> Result
    death:  Timeout? -> Result
    stream: Nil      -> Stream
    kill:   Nil      -> Nil
}
typedef Timeout: Index
```
Using ```instance.ready``` or ```instance.death``` will return a Promise object, that either gets fullfilled with a result or rejected with an error. If you set a RegExp as filter, the result will contain the matched string - otherwise it contains ```Nil```.
```
typedef Result:  {
    data: String | Nil
}
```
```ìnstance.stream``` exposes the instance's stdin and stdout/stderr as a duplexstream. As result you can prepend a readstream and append a writestream to your duplexstream.
```
typdef Stream: {
    write: String | Buffer -> Nil
    pipe:  Stream          -> Nil
}
```

# Usage
If you just want to wait until your process is ready, which gets determined by your filter condition, create a process with your desired command and filter, that validates stdout/stderr and will only set the process to ready, when the validation is successfull.
This can happen in three different ways: 
  1. The filter is a string and the output contains this string
  2. The filter is a regular expression and the output is a match
  3. The filter is a function, takes the output and returns ```true```

Afterwards you can await the ready-state with a specified timeout.
```js
import { process } from "core-worker";

const result = await process("your command", "filter condition").ready(1000);
```
You also have the possibility to wait until your process is finished, which is shown in the next example. This time you don't need to set a filter, unless you want to wait until the process is ready additionally. Afterwards you can await the finished-state with or without a specified timeout.
```js
import { process } from "core-worker";

const result = await process("your command").death();
```
If you want to compose a chain of streams containing your process, you can use ```instance.stream``` to write data into ```instance.stdin``` and read data out of ```instance.stdout/instance.stderr```.
```js
import { process } from "core-worker";

readstream.pipe(process("your command").stream()).pipe(writestream);
```
# Examples
How to use CoreWorker properly and for which use cases it is suitable is shown with the following examples.

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
The example will start the http-Server and returns a ```promise```, that either gets resolved with a ```Result``` or rejected with an ```error```. CoreWorker now validates any output with the filter condition "Server is ready.". If it succesfully valdates within 1000 milliseconds, the promise gets resolved with an empty result - otherwise it gets rejected.
Keep in mind, that ```Result``` can also return the mathed string, if your filter is a regular expression.

## Wait until process has finished
This example shows how to wait for a process to be successfully executed and closed.
This time we want to copy a given file, named "/path/to/file" with the "cp"-command into a new location "/newLocation/copiedFile" and wait until this operation has successfully finished:

```js
import { process } from "core-worker";

try {
    const result = await process("cp path/to/file /newLocation/newFile").death();
    
    // work with result
} catch(err) {
    // handle err
}
```
The example ignores the timeout, since we promise that only this time it's really acceptable to wait until the end of days for our copy operation to finish. So Process.death allows you to omit this parameter, even though this isn't recommmended and even forbidden when awaiting the ready state of a process.

## Use process as stream
This examples shows how to compose single processes unix-style, but instead of using the pipe operator "|" (e.g. cat file.txt | grep something), you can combine them with the canonical "pipe" method exposed by every node.js stream, including our processes:

So lets assume that we want to read a file "/private/movie/project", ...
```
It is a period of civil war. Rebel spaceships, striking from a hidden base,
have won their first victory against the evil Galactic Empire.
During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon,
the DEATH STAR, an armored space station with enough power to destroy an entire planet.
Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, 
custodian of the stolen plans that can save her people and restore freedom to the galaxy . . .
```
... grep for "galaxy" and write the results to "/ocurrences"
```js
import { process } from "CoreWorker";
import fs from "fs";

fs.createReadStream(file).pipe(process("grep galaxy").stream()).pipe(fs.createWriteStream("/ocurrences"));
```
By using processes as streams you are generally able to create language agnostic and easily manageable data transform pipelines out of single processes via node.js.

## Use all process functions at once
Sometimes it is necessary to get notified about multiple state changes of a single instance of a specific process and at the same time interact with them. Accordingly the next example shows you how to work with multiple instance states at once. 
As an example we use a simpe chat application, that logs "Chat ready", when it is able to accept messages.
```js
import { process } from "core-worker";

const simpleChat = process("node chat.js", "Chat ready");
const chatInput  = process.stream();

process.stdin.pipe(chatInput).pipe(process.stdout);
setTimeout(() => simpleChat.kill(), 360000); // wait an hour and close the chat

try {
      await simpleChat.ready(500);
      console.log("You are now able to send messages.");

      await simpleChat.death();
      console.log("Chat closed");
} catch(err) {
    // handle err
}
```
Please note that ```instance.stream``` throws an error, if you execute ```instance.ready/instance.death``` before.

# Testing

You can test CoreWorker with mocha by executing ```make test``` in the root directory of the project.

# Contributing

If you want to contribute to this repository, please ensure ...
  - to use ```make``` for deployment (it validates the source code and transpiles it to /lib).
  - to follow the existing coding style.
  - to use the linting tools that are listed in the package.json (which you get for free when using ```make```)
  - to add and/or customize unit tests for any changed code.
  - to reference an issue in your pull request with a small description of your changes.
