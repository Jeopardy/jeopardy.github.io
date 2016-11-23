var config = require('./config');
var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
var sessions = {}; //{sessionCode1: [clientId1, clientName1, clientScore1...]...}
var admins = {}; //{sessionCode1: adminId1...}

app.listen(config.serverPort);
console.log("Starting server on port " + config.serverPort);
count = 0;
io.on('connection', function(socket) {
  socket.on("connected", function(data){
    if(data.sessioncode in sessions){
      sessions[data.sessioncode].push([data.clientid, data.name, 0])
      for(var j = 0; j < sessions[data.sessioncode].length; j++){
        io.to(sessions[data.sessioncode][j][0]).emit('newUser', {users: sessions[data.sessioncode]});
      }
      io.to(admins[data.sessioncode]).emit('updateUsers', {users: sessions[data.sessioncode]});
    }
    //users.push([data.id, data.name]);
    //io.emit("newUser", {users: users});
  });
  socket.on("addScore", function(data){
    sessionCode = data.sessionCode;
    userId = data.userId;
    points = data.points;
    console.log("hi");
    if(sessions[sessionCode] != undefined){
      console.log("foo1");
      for(var i = 0; i < sessions[sessionCode].length; i++){
        console.log("foo2");
        if(sessions[sessionCode][i][0] == userId){
            console.log("foo3");
            sessions[sessionCode][i][2]+=points;
            io.to(admins[data.sessionCode]).emit('updateUsers', {users: sessions[data.sessionCode]});
            break;
        }
      }
    }
  });
  socket.on("queryUsers", function(data){
    socket.emit("newUser", {users: sessions[data.sessioncode]});
  });
  socket.on("removeUser", function(data){
    id = data.id;
    code = data.code;
    if(code in sessions){
      for(var j = 0; j < sessions[code].length; j++){
        if(sessions[code][j][0] == id){
          sessions[code].splice(j, 1);
        }
      }
      for(var j = 0; j < sessions[code].length; j++){
        io.to(sessions[code][j][0]).emit('newUser', {users: sessions[code]});
      }
      io.to(admins[code]).emit('updateUsers', {users: sessions[code]});
    }

  });
  socket.on("clearUsers", function(data){
    users = [];
    io.emit("newUser", {users: users});
  });
  socket.on("newSession", function(data){
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    code = "";
    for(var i = 0; i < data.len; i++){
      code+=chars[Math.floor(Math.random()*chars.length)];
    }
    sessions[code] = [];
    admins[code] = data.id;
    socket.emit("generatedCode", {code: code});

  });
  socket.on("queryAll", function(data){
    if(data.password == "nowii4me"){
      socket.emit("sendingAll", {sessions: sessions, admins: admins});
    }
  });
});
