const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

let users = [];

app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/public/index.html'));
});

io.on('connection', function(socket) {
	socket.on('login', function (msg) {
		socket.username = msg;
	 	socket.broadcast.emit('user connect', msg);
	 	socket.emit('online users', users);
	 	users.push(socket.username);
	});
	socket.on('chat message', function (msg) {
		socket.broadcast.emit('chat message', msg);
	});
	socket.on('disconnect', function (msg) {
		socket.broadcast.emit('user disconnect', socket.username);
		let idx = users.indexOf(socket.username);
		users.splice(idx, 1);
	});
})

http.listen(4000, function() {
	console.log('listening on *:4000');
})