import http from "http";

/**
 * First a http-Server is needed
 */
const server = http.createServer(function(req, res) {
    console.log("Got request");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Okay");
});

/**
 * Upgrades to Websocket
 */
server.on("upgrade", function(req, socket) {
    const handshake = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
                    "Upgrade: WebSocket\r\n" +
                    "Connection: Upgrade\r\n" +
                    "\r\n";

    socket.write(handshake);
    socket.on("end", function() {
        console.log("Closing Server");
        server.close();
    });
});

/*
 * Starts the Http Server listening on localhost:1337
 */
server.listen(1337, "127.0.0.1", function() {
    console.log("Listening on 127.0.0.1:1337");
    const options = {
        port:     1337,
        hostname: "127.0.0.1",
        headers:  {
            Connection: "Upgrade",
            Upgrade:    "websocket"
        }
    };
    const req     = http.request(options);

    req.end();

    /**
     * Upgrades Request to Websocket
     */
    req.on("upgrade", function(res, socket) {
        console.log("Request was upgraded successfully to new Websocket");
        socket.end();
    });
});
