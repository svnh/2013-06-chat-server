/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
var messages = []; //todo: handle multiple rooms

var parseMsgObj = function (JSONmessage) {
  message = JSON.parse(JSONmessage);
  var result = {
    "username": message.username || "anon",
    "createdAt": new Date(),
    "text": message.text || undefined
  };
  return result;
};

var tempX = JSON.stringify({"results":[{"text":" hello","createdAt":"2013-07-09T19:05:28.916Z","updatedAt":"2013-07-09T19:05:28.916Z","objectId":"RhhvKuJMga"},{"text":" Messageadsfdf","createdAt":"2013-07-09T19:04:51.494Z","updatedAt":"2013-07-09T19:04:51.494Z","objectId":"B1UaarZgWa"},{"username":"Chief Keef","text":"Where all the spambot shawties at?","createdAt":"2013-07-09T17:59:07.357Z","updatedAt":"2013-07-09T17:59:07.357Z","objectId":"uS73zEY9wI"},{"username":"Chief Keef","text":"Where all the spambot shawties at?","createdAt":"2013-07-09T17:59:06.280Z","updatedAt":"2013-07-09T17:59:06.280Z"}]});
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var handleRequest = function(req, res) {

  var handleResponse = function(statusCode, responseBody, type){
    var headers = defaultCorsHeaders;
    if (type === 'text'){
      headers['Content-Type'] = "text/plain";
    } else if (type === 'JSON') {
      headers['Content-Type'] = "application/json";
    }
    res.writeHead(statusCode, headers);
    res.end(responseBody);
  };

  var path = url.parse(req.url).path.split("/");

  // verify valid url status
  if (path[1] !== 'classes' || path.length !== 3) {
    handleResponse(404, "not a valid URL", 'text');
  } else {

    // route requests
    if (req.method === "GET") {
      // console.log(JSON.stringify(messages));
      // handleResponse(200, JSON.stringify(messages), 'text');
      var temZ = JSON.stringify({"results": messages });
      console.log(temZ);
      handleResponse(200, temZ, 'text');

    } else if (req.method === "POST") {

      var result = "";

      // we start receiving data
      req.on("data", function(message) {
        result += JSON.stringify(parseMsgObj(message));
      });

      // we finish receiving data
      req.on("end", function(){
        messages.push(result);
        temp = {
          "result": result
        };
        handleResponse(201, "message recieved", 'text');
        // handleResponse(200, JSON.stringify(temp), 'JSON');
      });
    }
  }

  // console.log("Serving request type " + req.method + " for url " + req.url);
  handleResponse(200, "awesome job", 'text');
};

exports.handleRequest = handleRequest;