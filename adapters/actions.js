const users = [];
const rooms = {
	'global#1': [],
	'global#2': [],
	'global#3': []
}
const sockets = [];

const PUBLIC_ROOM_NAMES = {
	'global#1': 'Global chat',
	'global#2': 'All fun and games',
	'global#3': 'Dig bick energy'
}

const CHAT_MESSAGE_TYPE = {
	OUTGOING: 'outgoing',
	INCOMING: 'incoming',
	STATUS_UPDATE: 'status update'
}

const MESSAGE_TO_CLIENT_TYPE = {
	USER_JOIN: 'user join',
	USER_RENAME: 'user rename',
	USER_LEAVE: 'user leave',
	USER_DISCONNECT: 'user disconnect',
	SERVE_ONLINE_USERS: 'online users',
	ROOM_CHANGE: 'room change',
}

function login (msg, socket, io) {
	socket.username = msg;
	socket.join('global#1');
	socket.room = 'global#1';
	socket.broadcast.to(socket.room).emit('user join', msg);
	socket.emit('online users', rooms['global#1']);
	users.push(msg);
	rooms['global#1'].push(msg);
	sockets.push(socket);
}

function userRename (msg, socket, io) {
	let usersIdx = users.indexOf(msg.prevUser);
	let roomsIdx = rooms[socket.room].indexOf(msg.prevUser);

	socket.username = msg.newUser;
	users[usersIdx] = msg.newUser;
	rooms[socket.room][roomsIdx] = msg.newUser;

	socket.broadcast.emit('user rename', msg);
}

function chatMessage (msg, socket, io) {
	msg.type = CHAT_MESSAGE_TYPE.INCOMING;
	socket.broadcast.to(socket.room).emit('chat message', msg);
}

function changeToPublicRoom (msg, socket) {
	let roomsIdx = rooms[socket.room].indexOf(socket.username);
	rooms[socket.room].splice(roomsIdx, 1);

	socket.emit('online users', rooms[msg.currentRoom]);
	socket.emit('room change', PUBLIC_ROOM_NAMES[msg.currentRoom]);
	socket.join(msg.currentRoom);
	socket.room = msg.currentRoom;

	rooms[msg.currentRoom].push(socket.username);
	socket.broadcast.to(msg.currentRoom).emit('user join', socket.username);
}

function changeToPrivateRoom (msg, socket) {
	socket.emit('online users', (rooms[msg.currentRoom] === undefined ? [] : rooms[msg.currentRoom]));
	socket.emit('room change', 'Private: ' + msg.currentRoom);

	socket.join(msg.currentRoom);
	socket.room = msg.currentRoom;
	let receivingSocket = sockets[users.indexOf(msg.currentRoom.split('-')[1])];

	if (rooms[msg.currentRoom] === undefined) {
		receivingSocket.emit('private message request', socket.username);
		rooms[msg.currentRoom] = [];
	}
}

function privateMessage(msg, socket, io) {

}

function roomChange (msg, socket, io) {
	socket.leave(msg.prevRoom);
	socket.broadcast.to(msg.prevRoom).emit('user leave', socket.username);

	if (msg.type === 'public') {
		changeToPublicRoom(msg, socket);
	} else if (msg.type === 'private') {
		changeToPrivateRoom(msg, socket);
	}
}

function disconnect (msg, socket, io) {
	if (socket.username !== undefined) {
		let usersIdx = users.indexOf(socket.username);
	 	let roomsIdx = rooms[socket.room].indexOf(socket.username);
		
		socket.broadcast.emit('user disconnect', socket.username);
		users.splice(usersIdx, 1);
		rooms[socket.room].splice(roomsIdx, 1);
	}
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