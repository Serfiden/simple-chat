const users = [];
const sockets = [];

const MESSAGE_TYPES = {
	OUTGOING: 'outgoing',
	INCOMING: 'incoming',
	STATUS_UPDATE: 'status update'
}

function login (msg, socket, io) {
	socket.username = msg;
	socket.broadcast.emit('user connect', msg);
	socket.emit('online users', users);
	users.push(socket.username);
	sockets.push(socket);
}

function userRename (msg, socket, io) {
	socket.username = msg.newUser;
	users[users.indexOf(msg.prevUser)] = msg.newUser;
	io.emit('user rename', msg);
}

function privateMessage (msg, socket, io) {

}

function chatMessage (msg, socket, io) {
	msg.type = MESSAGE_TYPES.INCOMING;
	socket.broadcast.emit('chat message', msg);
}

function disconnect (msg, socket, io) {
	socket.broadcast.emit('user disconnect', socket.username);
	let idx = users.indexOf(socket.username);
	users.splice(idx, 1);
	sockets.splice(idx, 1);
}

const ACTIONS = {
	LOGIN: login,
	USER_RENAME: userRename,
	PRIVATE_MESSAGE: privateMessage,
	GLOBAL_MESSAGE: chatMessage,
	DISCONNECT: disconnect,
}

function actionMapper (channel, msg, socket, io) {
	ACTIONS[channel](msg, socket, io);
} 

module.exports = actionMapper;