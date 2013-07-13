var http = require("http");
var requestListener = require("./request-handler");

var port = 8081;
var ip = "127.0.0.1";

var server = http.createServer(requestListener.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
