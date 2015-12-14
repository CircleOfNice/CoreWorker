"use strict";

var fails = function fails() {
    throw new Error("Process failed");
};

setTimeout(fails, 5);

//# sourceMappingURL=Failscript.js.map