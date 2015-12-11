# CoreWorker
<img src="https://scontent-frt3-1.cdninstagram.com/hphotos-xap1/t51.2885-15/e15/11281977_943814572305837_858119153_n.jpg" />

# Motivation
Because we believe working with processes in node.js needs too much boilerplate code for most use cases, we reevaluated the current process API and finally build CoreWorker.
CoreWorker aims at simplifying process management by making the most prominent lifefcycle events/states explicit so that they can be awaited. This is done by wrapping some events and hooks around node's internal process module to determine the exact moments they are triggered.

# Installation

You may install CoreWorker with npm 
```js
npm install core-worker
``` 

# API
By default you can import CoreWorker with ```import { process } from "core-worker";```. Just call process with a ```Command``` and an optional ```Condition``` to receive an instance, where ```Condition``` is used to determine the moment it is ready. A command has to use absolute paths and should be the same as on your OS specific command line interface.
```
typedef process:   Command -> Condition? -> Process
typedef Command:   String
typedef Condition: Nil | String | String -> Boolean | RegExp
```
Now you are able to interact with the returned instance in multiple ways: You can wait until the process is ready or dead or use it for example as a stream.  Additionally it is always possible to kill your instance with ```instance.kill()```.
```
typedef Process: {
    ready:  Timeout  -> Promise
    death:  Timeout? -> Promise
    stream: Nil      -> Stream
    kill:   Nil      -> Nil
}
typedef Timeout: Index
```
```instance.ready``` or ```instance.death``` will return a Promise object, that either gets fullfilled with a ```Result``` or rejected with an ```Error```. If you set a ```RegExp``` as the condition, ```Result``` will contain the matched string - otherwise there will be ```Nil```.
```
typedef Result:  {
    data: String | Nil
}
```
```ìnstance.stream``` exposes ```instance.stdin``` and ```instance.stdout```/```instance.stderr``` as a stream. Accordingly you can prepend a ReadStream to your instance and/or pipe your stream into a WriteStream.
```
typedef Stream: {
    write: String | Buffer -> Nil
    pipe:  Stream          -> Nil
}
```

# Usage
If you just want to wait until some ready condition is reached, create a process with your desired command and your requirement for the ready state of the process. The condition is used to filter incoming data from ```instance.stdout```/```instance.stderr``` until it is triggered. In this case the process is in it's ready state, which can be reached in three different ways:
  1. The ```condition``` is a string and the output contains this string
  2. The ```condition``` is a regular expression and the output is a match
  3. The ```condition``` is a function, takes the output and returns ```true```

You can now await the ready state with a timeout:
```js
import { process } from "core-worker";

const result = await process("your command", "condition").ready(1000);
```

As shown in the example below, you can wait until your process has finished. This time a condition does not need to be set, unless you want to wait until the process is ready, too. Afterwards the finished state is awaitable with or without a specified timeout:
```js
import { process } from "core-worker";

const result = await process("your command").death();
```

If you want to compose a chain of streams containing your process, you can use ```instance.stream``` to write data into ```instance.stdin``` and read data out of ```instance.stdout```/```instance.stderr```.
```js
import { process } from "core-worker";

readstream.pipe(process("your command").stream()).pipe(writestream);
```

# Examples
The following examples present some common use cases and how they are mastered using CoreWorker:

## Wait until a process is ready
Let's suppose we want to wait until our HTTP-Server is ready - but no longer than 1000 milliseconds.
So first we write a simple server script ...
```js
//Server.js
const server = http.createServer(...);

server.listen(1337, "127.0.0.1", function() {
    // This log will notify our main process when the server is ready to use
    console.log("Server is ready.");
});
```
... and finally execute it with CoreWorker:
```js
//startServer.js
import { process } from "core-worker";

try {
    // Here we define "Server is ready" as our condiition 
    // and use a timeout of 1000ms.
    // Accordingly, the process gets ready when a log 
    // contains this string within the given timeout.
    const result = await process("node Server.js", "Server is ready.").ready(1000);
    
    console.log(result);
} catch(err) {
    // handle err
}
```
The example will start the HTTP-Server and returns a ```Promise```, that either gets resolved with a ```Result``` or rejected with an ```Error```. 

CoreWorker now evaluates any output with the given ```Condition``` (in this case "Server is ready."). If it is triggered within 1000 milliseconds, the promise gets resolved with an empty ```Result``` - otherwise it gets rejected.

Keep in mind, that ```Result``` can also return the matched string, if your ```Condition``` is a regular expression.

## Wait until a process has finished
This example shows how to wait for a process to be successfully executed and closed.

This time we want to copy a given file, named ```/path/to/file``` with the ```cp```-command into a new location ```/newLocation/copiedFile``` and wait until this operation has successfully finished:

```js
import { process } from "core-worker";

try {
    const result = await process("cp path/to/file /newLocation/newFile").death();
    
    // work with result
} catch(err) {
    // handle err
}
```
The example ignores the timeout, since we promise that only this time it's really acceptable to wait until the end of days for our copy operation to finish :astonished:. So ```process.death``` allows you to omit this parameter, even though this isn't recommended and even forbidden when awaiting the ready state of a process.

## Use a process as a stream
This examples shows how to compose single processes unix-style. But instead of using the pipe operator | (e.g. ```cat file.txt | grep something```), we can combine them with the canonical "pipe" method exposed by every node.js stream:

So let's assume that we want to read a file ```/private/movie/project```, ...
```
It is a period of civil war. Rebel spaceships, striking from a hidden base,
have won their first victory against the evil Galactic Empire.
During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon,
the DEATH STAR, an armored space station with enough power to destroy an entire planet.
Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, 
custodian of the stolen plans that can save her people and restore freedom to the galaxy . . .
```
... grep for "galaxy" and write the results to ```/ocurrences```:
```js
import { process } from "CoreWorker";
import fs from "fs";

fs.createReadStream(file)
    .pipe(process("grep galaxy").stream())
    .pipe(fs.createWriteStream("/ocurrences"));
```
By using processes as streams you are generally able to create language agnostic and easily manageable data transform pipelines out of single processes, leveraging all the shiny streaming stuff of node.js.

## Use all process functions at once
Sometimes it is necessary to get notified about multiple state changes of a a single instance belonging to a specific process while at the same time interacting with it. 

Accordingly the next example shows you how to work with multiple instance states at once. Exemplary we use a simple chat application, that logs "Chat ready", when it is able to accept messages:
```js
import { process } from "core-worker";

const simpleChat = process("node chat.js", "Chat ready");

setTimeout(() => simpleChat.kill(), 360000); // wait an hour and close the chat

simpleChat.ready(500)
    .then(console.log.bind(console, "You are now able to send messages."))
    .then(::simpleChat.death)
    .then(console.log.bind(console, "Chat closed"))
    .catch(() => /* handle err */);
```
Please note that ```instance.stream``` would throw an error, if ```instance.ready```/```instance.death``` is executed earlier.

# Testing

You can test CoreWorker with mocha by executing ```make test``` in the root directory of the project.

# Contributing

If you want to contribute to this repository, please ensure ...
  - to use ```make``` for deployment (it validates the source code and transpiles it to ```/lib```).
  - to follow the existing coding style.
  - to use the linting tools that are listed in the ```package.json``` (which you get for free when using ```make```).
  - to add and/or customize unit tests for any changed code.
  - to reference an issue in your pull request with a small description of your changes.
All contributors are listed in the ```AUTHORS``` file, sorted by the time of their first contribution.
