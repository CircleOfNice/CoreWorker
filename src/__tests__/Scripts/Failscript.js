const fails = function() {
    throw new Error("Process failed");
};

setTimeout(fails, 5);
