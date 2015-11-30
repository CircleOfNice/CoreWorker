# CoreExec
Executing commands with ease

## Usage
Start Process and wait until it is ready
```js
import CoreExec from "CoreExec";

const process = CoreExec.create("node Test.js", "Test is ready");
const result  = await process.ready(100);

console.log(result);
```
Start Process and wait until it is finished
```js
import CoreExec from "CoreExec";

const process = CoreExec.create("cp file file2");
const result  = await process.death(100);

console.log(result);
```
Start Process and handle it as a stream
```js
import CoreExec from "CoreExec";
import fs from "fs";

const process = CoreExec.create("grep something");

fs.createReadStream("path to file").pipe(process.stream()).pipe(writeStream);
```

## API

```js
typedef Filter = String || Function || RegExp;

CoreExec.create(<String>, <Filter?>) -> process

process.ready(<Index>)
process.death(<Index?>)
process.stream()
```
