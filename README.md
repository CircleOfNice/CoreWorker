# CoreExec
CoreExec is an abstraction of node's spawn-command. It offers additional functionality, by passing an optional filter argument, which listens on stdout and stderr. This filter can be usefull, when you want to wait for a process to be ready.
```
typedef Filter: <String> | <RegExp> | <String> -> <Boolean> | <null>
```

## Ready - Example
We want to wait until out http-server is ready - but not longer than 1000 milliseconds

```js
//Server.js
const server = http.createServer(...);

server.listen(1337, "127.0.0.1", function() {
    console.log("Server is ready.");
});

//startServer.js
import { process } from "CoreWorker";

try {
    const result = await process("node Server.js", "Server is ready.").ready(1000);
    
    console.log(result);
} catch(err) {
    console.log(err);
}
```
This example runs "Server.js" in a child process and waits 1000 milliseconds to get the server started. When the server is ready a result is returned. The result will be null, if your filter is of type ```<String> | <Function>```. If the filter is of type ```<RegExp>```, the result returns the matched string.
```
typedef Result: {
    data -> <String> | <null>
}
```
If the timeout exceeds, the process returns an Error, containing "Timeout exceeded." as message. If you want to wait for a process to be ready, the timeout argument isn't optional.

## Death - Example
If you rather want to wait until a process is finished, you can achieve this with the following exmaple:
We want to copy a given file with the "cp"-command:

```js
import { process } from "CoreWorker";

try {
    const result = await process("cp file copiedFile").death();
    
    console.log(err);
} catch(err) {
    console.log(err);
}
```
This time we do it without waiting a given time, that can only be achieved with death, because the timeout-argument is optional for this use case.

## Stream - Example
Sometimes it is necessary to communicate with your child process. This can be achieved with the stream command:
We want to read a file, grep for something with our process and use the output for other operations:
```js
import { process } from "CoreWorker";
import fs from "fs";

fs.createReadStream(file).pipe(process("grep something").stream()).pipe(other operation);
```
Due to spawn-command the process waits for input that can be written in the stream. The output that is generated in stdout and stderr will be written in the "other operation"-stream.

## API

```js
typedef Filter: <Nil> | <String> | <String> -> <Boolean> | <RegExp>

typedef Timeout: <Index>

typedef Result: {
    data: <String> | <Nil>
}

typedef process: <String> -> <Filter?> -> <Process>

typedef Process: {
    ready:  <Timeout>  -> <Result>
    death:  <Timeout?> -> <Result>
    stream: <>         -> <Stream>
    kill:   <>         -> <>
}

typdef Stream: {
    write: <String> | <Buffer> -> <Nil>
    pipe:  <Stream>            -> <Nil>
}
```
