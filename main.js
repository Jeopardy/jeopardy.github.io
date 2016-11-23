//var socket = io.connect('wss://6a8c474a.ngrok.io');
var socket = io.connect("ws://127.0.0.1:8080");
users = [];
thisId = -1;
thisName = "";
thisCode = "";
inUse = false;
thisSessions = {};
thisAdmins = {};
socket.on("sendingAll", function(data){
  thisSessions = data.sessions;
  thisAdmins = data.admins;
});
$(window).bind('beforeunload', function(){
  if(thisId != -1 && thisCode != ""){
    socket.emit("removeUser", {code: thisCode, id: thisId});
  }
});
$("#submit").click(function() {
	thisName = $("#inputNumber").val();
  thisCode = $("#inputCode").val();
	if(thisName == "0.0"){
		alert("clearing users...");
		socket.emit("clearUsers", {});
	}
	if(thisId != -1){
		return;
	}
	inUse = false;
	console.log("foo");
	if(thisName.length == 0){
		inUse = true;
	}
	users.forEach(function(user){
		if(user[1] == thisName){
			alert("That team number has already been chosen!");
			inUse = true;
		}
	});
	if(!inUse){
	  thisId = socket.io.engine.id;
	  socket.emit("connected", {sessioncode: thisCode, name: thisName, clientid: thisId});
  }
});
socket.on("newUser", function(data){
	users = data.users;
	$("#onlineTeams").empty();
	for(var i = 0; i < users.length; i++){
		if(users[i][0] == thisId){
			$("#onlineTeams").append('<li class="list-group-item" style="background-color: rgba(93, 208, 55, 0.5)">Team '+users[i][1]+'</li>');
		}else{
			$("#onlineTeams").append('<li class="list-group-item">Team '+users[i][1]+'</li>');
		}
	}
});
$('a[href*="#"]:not([href="#"])').click(function() {
	if(inUse){
		return false;
	}
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
});

$(document).ready(function(){
	//socket.emit("queryUsers", {});
});
