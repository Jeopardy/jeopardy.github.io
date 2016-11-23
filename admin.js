// var socket = io.connect('wss://6a8c474a.ngrok.io')
var socket = io.connect("ws://127.0.0.1:8080");
id = socket.io.engine.id;
codeLen = 6;
currentCode = "";
$("#generateCode").click(function() {
  socket.emit("newSession", {id: socket.io.engine.id, len: codeLen});

  //socket.emit("newSession", {code: code});
});
socket.on("generatedCode", function(data){
  code = data.code;
  $("#code").val(code);
  currentCode = code;
});
socket.on("updateUsers", function(data){
	users = data.users;
	$("#onlineTeams").empty();
	for(var i = 0; i < users.length; i++){
    $("#onlineTeams").append('<li class="list-group-item" style="font-size:1.75rem"><span class="tag tag-default tag-pill float-xs-right">'+users[i][2]+'</span>Team '+users[i][1]+'</li>');
  		//$("#onlineTeams").append('<li class="list-group-item">Team '+users[i][1]+'</li>');
	}
});
