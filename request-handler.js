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

exports.handleRequest = function(req, res) {
  //console.log('req.url', req.url);

  var handleResponse = function(statusCode, responseBody, type){
    var headers = defaultCorsHeaders;
    if (type === 'text'){
      headers['Content-Type'] = "text/plain";
    } else if (type === 'json') {
      headers['Content-Type'] = "application/json";
    } else if (type === 'html') {
      headers['Content-Type'] = "text/html";
    } else if (type === 'js') {
      headers['Content-Type'] = "application/javascript";
    } else if (type === 'css') {
      headers['Content-Type'] = "text/css";
    }
    res.writeHead(statusCode, headers);
    res.end(responseBody);
  };

  var path = url.parse(req.url).pathname.split('/');
  var room = path[1] === 'classes' ? path[2] : null;

  if (req.method === 'GET' && url.parse(req.url).pathname === '/' || url.parse(req.url).pathname === '/index.html') {
    //readFileSync returns the contents of the specified file from 'relPath'
    var indexHTML = fs.readFileSync('./2013-06-chat-client/index.html', 'utf8');
    handleResponse(200, indexHTML, 'html');
  } else if (req.method === 'GET' && url.parse(req.url).pathname === '/css/reset.css') {
    var resetCSS = fs.readFileSync('./2013-06-chat-client/css/reset.css', 'utf8');
    handleResponse(200, resetCSS, 'css');
  } else if (req.method === 'GET' && url.parse(req.url).pathname === '/css/styles.css') {
    var styleCSS = fs.readFileSync('./2013-06-chat-client/css/styles.css', 'utf8');
    handleResponse(200, styleCSS, 'css');
  } else if (req.method === 'GET' && url.parse(req.url).pathname === '/js/setup.js') {
    var setupJS = fs.readFileSync('./2013-06-chat-client/js/setup.js', 'utf8');
    handleResponse(200, setupJS, 'js');
  } else if (room) {
    if (req.method === 'GET' || req.method === 'OPTIONS') {
    var roomData = sql.getRoomMessages(room);
    handleResponse(200, roomData, 'json');
    } else if (req.method === 'POST') {
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function(){
        sql.putDataDB(data, room);
      });
    }
  } else {
    handleResponse(404, "not a valid URL", 'text');
  }
};