/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
var fs = require('fs');
var sql = require("../SQL/persistent_server.js");

var messages = []; //todo: handle multiple rooms

var parseMsgObj = function (message) {
  var result = {
    "username": message.username || "anon",
    "createdAt": new Date(),
    "text": message.text || undefined
  };
  return result;
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var handleRequest = function(req, res) {
  console.log('req.url', req.url);

  var handleResponse = function(statusCode, responseBody, type){
    var headers = defaultCorsHeaders;
    if (type === 'text'){
      headers['Content-Type'] = "text/plain";
    } else if (type === 'JSON') {
      headers['Content-Type'] = "application/json";
    } else if (type === 'html') {
      headers['Content-Type'] = "text/html";
    }
    res.writeHead(statusCode, headers);
    res.end(responseBody);
  };

  var path = url.parse(req.url).path.split("/");

  var chatPath = '/Users/savannahkunovsky/2013-06-databases/2013-06-chat-server/2013-06-chat-client';

  // verify valid url status
   if (path[1] !== 'classes') {
    var relPath = chatPath + req.url;
    //using regex is not a good idea, use url.parse search instead
    //need to match query because usernames are inserted
    if (req.url.match(/\?/)) {
      relPath = chatPath + '/index.html';
    }
    if( fs.existsSync(relPath) ){
      //readFileSync returns the contents of the specified file from 'relPath'
      var filecontent = fs.readFileSync(relPath, 'utf8');
      handleResponse(200, filecontent, 'html');
    } else {
      handleResponse(404, "not a valid URL", 'text');
    }
  } else {

    // route requests
    if (req.method === "GET") {
      var temZ = JSON.stringify({"results": messages });
      console.log(temZ);
      handleResponse(200, temZ, 'test');

    } else if (req.method === "POST") {

      var result = "";

      // we start receiving data
      req.on("data", function(chunk) {
        result += chunk;
      });

      // we finish receiving data
      req.on("end", function(){
        messages.push(parseMsgObj(JSON.parse(result)));
        handleResponse(201, "message recieved", 'text');
      });
    }
  }

  handleResponse(200, "awesome job", 'text');
};

exports.handleRequest = handleRequest;