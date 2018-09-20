const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
let actions = require('./adapters/actions.js');

const CHANNELS = {
	LOGIN: 'login',
	USER_RENAME: 'user rename',
	PRIVATE_MESSAGE: 'private message',
	GLOBAL_MESSAGE: 'chat message',
	DISCONNECT: 'disconnect',
	ROOM_CHANGE: 'room change'
}

app.get('/', function(req, res) {
	res.sendFile(path.resolve('./public/index.html'));
});

io.on('connection', function(socket) {
	for (let key in CHANNELS) {
		if (CHANNELS.hasOwnProperty(key)) {
			socket.on(CHANNELS[key], function(msg) {
				actions(key, msg, socket, io);
			});
		}
	}
});

http.listen(4000, function() {
	console.log('listening on *:4000');
})