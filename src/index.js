/*
spawn: String x Timeout x (RegExp | String | Function) => Promise<Result>
   - Result {
       process: process
       data:    string
   }
   - Params:
       String: Kommando bspw. "rm -r file.txt"
       Timouet?: Wie lange warten, bis ein Ergebnis erreicht wurde
           Ergebnis: Prozess wurde nicht erfolgreich beendet, aber beendet || Bedingung nicht rechtzeitig erfüllt || Bedingung wurde erfüllt
       Abfragen auf onStdout -> data
               siehe onStdErr
                onStdErr
               RegEx --> //.exec(String)        --> resolve({gematchten string zurükgeben, process})
               String.indexOf(<String>)  	 --> resolve({datastring, process})
               Function(data) => Boolean || Err --> resolve({datastring, process})
                                --> (killProcesses), reject({error})
                onClose:
               reject(new Error(Process closed with code: <Code>))

execute: String x Timeout? => Promise<Result>
   - Result {
       process: process
       data:    string
   }
   - Params:
       String: Kommando bspw. "rm -r file.txt"
       Timeout?: Wie lange warten, bis ein Ergebnis erreicht wurde
           Ergebnis: Prozess wurde erfolgreich beendet || Prozess wurde nicht erfolgereich beendet || Prozess wurde nicht innerhalb des Timeouts beendet
       Abfragen auf onStdOut
               results.push(data)
                onStdErr
               result.push(error)
                onClose
               code === 0 ? resolve({process, results.join("")})
               code !== 0 ? reject(new Error(results iwie joinen))

intern:

const callback  = createCallback(filter);
const deferred = Q.defer();
const process  = exec(path..);
setTimeout(function() {
   process.kill();
   deferred.reject():
}, timeout || 500);

on(“close“, code => code === 0 ? deferred.resolve() : deferred.reject());
process.stdout.on("data“, data => filter(Stdout(data)) ? deferred.resolve(data) : null);
process.stderr.on("data", data => filter(StdErr(data)) ? deferred.resolve(data) : null);
 */
console.log("Done");
