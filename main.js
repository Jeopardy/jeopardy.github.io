var socket = io.connect('wss://097b2ff2.ngrok.io');
users = [];
$("#submit").click(function() {
	console.log("foo");
	socket.emit("connected", {name: $("#inputNumber").val(), id: new Date().getTime()});
});
socket.on("newUser", function(data){
	users = data.users;
	$("#onlineTeams").empty();
	for(var i = 0; i < users.length; i++){
		$("#onlineTeams").append('<li class="list-group-item">Team '+users[i][1]+'</li>');
	}
});
$('a[href*="#"]:not([href="#"])').click(function() {
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
	socket.emit("queryUsers", {});
});
