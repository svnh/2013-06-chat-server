var http = require("http");
var requestListener = require("./request-handler");
var sql = require("../SQL/persistent_server.js");

sql.openConnection(function(){
  var port = 8081;
  var ip = "127.0.0.1";

  var server = http.createServer(requestListener.handleRequest);
  //starts server after connection is open
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
});

process.on('exit', function () {
  sql.closeConnection();
});