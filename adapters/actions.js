/*const users = [];
const sockets = [];
const rooms = [];*/


const users = [];
const rooms = {
	'global#1': [],
	'global#2': [],
	'global#3': []
}

const MESSAGE_TYPES = {
	OUTGOING: 'outgoing',
	INCOMING: 'incoming',
	STATUS_UPDATE: 'status update'
}

function filterByRoom (room) {

}

function login (msg, socket, io) {
	socket.username = msg;
	socket.join('global#1');
	socket.room = 'global#1';
	socket.broadcast.to(socket.room).emit('user join', msg);
	socket.emit('online users', rooms['global#1']);
	users.push(msg);
	rooms['global#1'].push(msg);
}

function userRename (msg, socket, io) {
	let usersIdx = users.indexOf(msg.prevUser);
	let roomsIdx = rooms[socket.room].indexOf(msg.prevUser);

	socket.username = msg.newUser;
	users[usersIdx] = msg.newUser;
	rooms[socket.room][roomsIdx] = msg.newUser;

	socket.broadcast.emit('user rename', msg);
}

function privateMessage (msg, socket, io) {

}


function chatMessage (msg, socket, io) {
	msg.type = MESSAGE_TYPES.INCOMING;
	socket.broadcast.to(socket.room).emit('chat message', msg);
}

function roomChange (msg, socket, io) {
	let roomsIdx = rooms[socket.room].indexOf(socket.username);

	socket.leave(msg.prevRoom);
	rooms[socket.room].splice(roomsIdx, 1);
	socket.broadcast.to(msg.prevRoom).emit('user leave', socket.username);
	
	socket.join(msg.currentRoom);
	socket.room = msg.currentRoom;
	socket.emit('online users', rooms[msg.currentRoom]);
	rooms[msg.currentRoom].push(socket.username);
	socket.broadcast.to(msg.currentRoom).emit('user join', socket.username);
}

function disconnect (msg, socket, io) {
	socket.broadcast.emit('user disconnect', socket.username);
	let idx = users.indexOf(socket.username);
	users.splice(idx, 1);
}

const ACTIONS = {
	LOGIN: login,
	USER_RENAME: userRename,
	PRIVATE_MESSAGE: privateMessage,
	GLOBAL_MESSAGE: chatMessage,
	DISCONNECT: disconnect,
	ROOM_CHANGE: roomChange
}

function actionMapper (channel, msg, socket, io) {
	ACTIONS[channel](msg, socket, io);
} 

module.exports = actionMapper;