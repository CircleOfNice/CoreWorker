# Motivation
CoreWorker is an abstraction of node's spawn-command, that offers additional functionality, by passing an optional filter argument, which listens on stdout and stderr. This filter can be usefull, when you want to wait for a process to be ready.
Additionally you can wait for a process to finish - without even passing a filter argument - as precondition of other tasks or even use the running process as a Duplex-Stream, in which you can write (process.stdin) and on which you can listen (process.stdout).

# Installation

You can install CoreWorker with npm 
```js
npm install core-worker
``` 
or just clone with git and import 
```js
import CoreWorker from "path/to/CoreWorker/index";
````

## API

```js
typedef Filter: Nil | String | String -> Boolean | RegExp

typedef Timeout: Index

typedef Result: {
    data: String | Nil
}

typedef process: String -> Filter? -> Process

typedef Process: {
    ready:  Timeout  -> Result
    death:  Timeout? -> Result
    stream: Nil      -> Stream
    kill:   Nil      -> Nil
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

const result = await process(Command, Filter).ready(Timeout);
```
Start a process and wait until it is finished
```js
import { process } from "core-worker";

const result = await process(Command, Filter?).death(Timeout?);
```
Start a process and use it as a stream
```js
import { process } from "core-worker";

readstream.pipe(process(Command, Filter?).stream()).pipe(writestream);
```
# Example

## Ready
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
    console.log(err);
}
```
This example runs the "Server.js" in a child process and waits 1000 milliseconds to get the server started. When the server is ready, a result is returned. The result will be null, if your filter is of type ```String | Function```. If the filter is of type ```RegExp```, the result returns the matched string.
If the timeout exceeds, the process returns an Error containing "Timeout exceeded." as message. If you want to wait for a process to be ready, the timeout argument isn't optional.

## Death
If you rather want to wait until a process is finished, you can achieve this with the following exmaple:
This time we want to copy a given file with the "cp"-command:

```js
import { process } from "core-worker";

try {
    const result = await process("cp file copiedFile").death();
    
    console.log(err);
} catch(err) {
    console.log(err);
}
```
For this example the timeout isn't really necessary and that's why you can simply omit this parameter - this is not allowed for ready().

## Stream
Sometimes it is necessary to communicate with your child process - write Input into it and receive the resulting output. This can be achieved with the following example:
We want to read a file, ...
```js
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
```
... grep for "Lorem" with our process and use the output for other operations:
```js
import { process } from "CoreWorker";
import fs from "fs";

fs.createReadStream(file).pipe(process("grep Lorem").stream()).pipe(other operation);
```
Due to the spawn-command the process waits for input that can be written in the stream. The output that is generated in stdout and stderr will be written in the "other operation"-stream.
