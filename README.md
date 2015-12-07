# Motivation
Handle child processes in node.js leads to a lot of boilerplate, even though the handling is only a mean of of running your main task correctly. Therefore CoreWorker tries to eliminate this overhead by offering you addtional features. In fact it is an abstraction of node's <a href="https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options">spawn</a>-command, that allows you to manage special lifecycle events of your child process. 
This means that you get the abillity to define a "ready"- and/or "finished"-state and determine a given reaction on state changes. That makes it easier to build preconditions for other processes or even let them exchange information like in a duplex stream, in which you can write (process.stdin) and on which you can listen to (process.stdout).

# Installation

You may install CoreWorker with npm 
```js
npm install core-worker
``` 

## API
A Process is created with a Command and an optional filter 
```js
typedef Filter:  Nil | String | String -> Boolean | RegExp
typedef process: String -> Filter? -> Process
```
The returned Process offers the following API
```js
typedef Timeout: Index
typedef Process: {
    ready:  Timeout  -> Result
    death:  Timeout? -> Result
    stream: Nil      -> Stream
    kill:   Nil      -> Nil
}

typedef Result:  {
    data: String | Nil
}

typdef Stream: {
    write: String | Buffer -> Nil
    pipe:  Stream          -> Nil
}
```

# Usage
Start a process and wait until it is ready
```js
import { process } from "core-worker";

const result = await process("your command", "filter condition").ready(1000);
```
Start a process and wait until it is finished
```js
import { process } from "core-worker";

const result = await process("your command", /filter condition/g).death();
```
Start a process and use it as a stream
```js
import { process } from "core-worker";

readstream.pipe(process("your command", Filter?).stream()).pipe(writestream);
```
# Examples

## Wait until process is ready
Let's suppose we want to wait until our http-server is ready - but not longer than 1000 milliseconds
So first we write a simple server script ...
```js
//Server.js
const server = http.createServer(...);

server.listen(1337, "127.0.0.1", function() {
    console.log("Server is ready.");
});
```
... and finally execute it with CoreWorker:
```js
//startServer.js
import { process } from "core-worker";

try {
    const result = await process("node Server.js", "Server is ready.").ready(1000);
    
    console.log(result);
} catch(err) {
    // handle err
}
```
This example runs the "Server.js" in a child process and waits 1000 milliseconds to get the server started. When the server is ready, a result is returned. The result will be null, if your filter is of type ```String | Function```. If the filter is of type ```RegExp```, the result returns the matched string.
If the timeout exceeds, the process returns an Error containing "Timeout exceeded." as message. If you want to wait for a process to be ready, the timeout argument isn't optional.

## Wait until processes has finished
If you rather want to wait until a process is finished, you can achieve this with the following exmaple:
This time we want to copy a given file with the "cp"-command:

```js
import { process } from "core-worker";

try {
    const result = await process("cp file copiedFile").death();
    
    console.log(err);
} catch(err) {
    // handle err
}
```
For this example the timeout isn't really necessary and that's why you can simply omit this parameter - this is not allowed for ready().

## Use process as stream
Sometimes it is necessary to communicate with your child process - write Input into it and receive the resulting output. This can be achieved with the following example:
We want to read a file, ...
```
Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
sed diam voluptua. 
At vero eos et accusam et justo duo dolores et ea rebum. 
Stet clita kasd gubergren, 
no sea takimata sanctus  est Lorem ipsum dolor sit amet.
```
... grep for "Lorem" with our process and use the output for other operations:
```js
import { process } from "CoreWorker";
import fs from "fs";

fs.createReadStream(file).pipe(process("grep Lorem").stream()).pipe(other operation);
```
Due to the spawn-command the process waits for input that can be written in the stream. The output that is generated in stdout and stderr will be written in the "other operation"-stream.

## Use all process functions at once
If you want to use the complete functionality of process at once, you have to start it with a stream first.
In this exmaple we want to start a chat application, that logs "Chat ready", when it accepts messages.
```js
import { process } from "core-worker";

const simpleChat = process("node chat.js", "Chat ready");
const chatInput  = process.stream();

simpleChat.death().then(() => console.log("Chat closed"));

try {
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

This module can be tested via the mocha framework. This can be executed directly in the direcotry with
```
make test
```

# Contributing

If you want to contribute to this repository, please take care to maintain the existing coding style. Please use the linting tools that are listed in the package.json. Add and/or customize unit tests for any changed code and reference an issue in your pull request.

## Checklist for a new pull request

- [ ] Is there an issue i can reference on?
- [ ] Is my code reasonable for eslint?
- [ ] is my code completely tested (unit/functional)?
- [ ] ```make``` doesn't abort?
