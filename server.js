var config = require('./config');
var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
var users = [];

app.listen(config.serverPort);
console.log("Starting server on port " + config.serverPort);
count = 0;
io.on('connection', function(socket) {
  socket.on("connected", function(data){
    count+=1;
    users.push([data.id, data.name]);
    io.emit("newUser", {users: users});
    console.log("new");
  });
  socket.on("queryUsers", function(data){
    socket.emit("newUser", {users: users});
  });
});
