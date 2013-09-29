var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    Cursor = require('./cursor.js');

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080

app.use(express.static(__dirname + "/public"));
server.listen(port);

var id = 1;
var cursors = {};

function newCursor(socket, id) {
  populateNew(socket);
  var cursor = new Cursor(id, 0, 0);
  cursors[socket.id] = cursor;
  socket.emit("new", {id: id});
  socket.broadcast.emit("create", {id:id, x:0, y:0, display:"none"});
}

function populateNew(socket) {
  for (var sid in cursors) {
    var c = cursors[sid];
    socket.emit("create", {id:c.id, x:c.x, y:c.y, display:"block"});
  }
}

io.sockets.on("connection", function(socket) {
  newCursor(socket, id);
  id++;
  //Update cursor position and send out to clients
  socket.on("update", function(data) {
    if (socket.id in cursors) {
      cursors[socket.id].x = data.x;
      cursors[socket.id].y = data.y;
      socket.broadcast.emit("update", {id:data.id, x:data.x, y:data.y});
    }
  });

  socket.on("disconnect", function(reason) {
    var delID = cursors[socket.id].id;
    io.sockets.emit("del", {id: delID});
    delete cursors[socket.id];
  });
});