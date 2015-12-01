process.stdin.resume();
process.stdin.on("data", function(data) {
    console.log(Buffer.isBuffer(data) ? data.toString() : data);
});
