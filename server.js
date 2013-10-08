var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    Client = require('./client.js');

var port = process.env.PORT || 8080

app.use(express.static(__dirname + "/public"));
server.listen(port);

// io.configure(function () {
//   io.set("transports", ["xhr-polling"]);
//   io.set("polling duration", 10);
// });

var id = 1;
var connected = 0;
var clients = {};

function newCursor(socket, id, name) {
  populateNew(socket);
  var client = new Client(id, 0, 0, name, "");
  clients[socket.id] = client;
  socket.emit("new", {id: id});
  socket.broadcast.emit("create", {id:id, x:0, y:0, display:"none", name:"", text: ""});
}

function populateNew(socket) {
  for (var sid in clients) {
    var c = clients[sid];
    socket.emit("create", {id:c.id, x:c.x, y:c.y, display:"block", name:c.name, text:c.text});
  }
}

io.sockets.on("connection", function(socket) {
  connected++;
  newCursor(socket, id);
  id++;
  io.sockets.emit("counter", {count: connected});

  //Update client position and send out to clients
  socket.on("update", function(data) {
    if (socket.id in clients) {
      if (("x" in data) && ("y" in data)) {
        socket.broadcast.emit("update", {id:data.id, x:data.x, y:data.y});
        clients[socket.id].updatePos(data.x, data.y);
      }
      if ("text" in data) {
        socket.broadcast.emit("update", {id:data.id, text:data.text});
        clients[socket.id].text = data.text;
      }
      if ("name" in data) {
        socket.broadcast.emit("update", {id:data.id, name:data.name});
        clients[socket.id].name = data.name;
      }
    }
  });

  socket.on("disconnect", function(reason) {
    var delID = clients[socket.id].id;
    connected--;
    io.sockets.emit("del", {id: delID});
    io.sockets.emit("counter", {count: connected});
    delete clients[socket.id];
  });
});