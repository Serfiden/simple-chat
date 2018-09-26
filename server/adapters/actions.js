const User = require('../models/User.js');
const Users = require('../models/collections/Users.js');
const Rooms = require('../models/collections/Rooms.js');

function login (msg, socket, io) {
	let newUser = new User(msg, socket);
	Rooms.getByName('global#1').addUser(newUser);
	Users.add(newUser);
}

function userRename (msg, socket, io) {
	Users.getByName(msg.prevUser).rename(msg.newUser);
}

function chatMessage (msg, socket, io) {
	let user = Users.getById(socket.id);
	user.sendMessage(msg);
	Rooms.getByName(user.getRoom()).addMessage(msg);
}

function roomChange (msg, socket, io) {
	let user = Users.getById(socket.id);
	Rooms.getByName(user.getRoom()).removeUser(user);
	user.leaveRoom();

	if (msg.currentRoom === 'PRIVATE') {
		let partner = Users.getByName(msg.roomPartner);
		let privateRoom = Rooms.getPrivateRoom(user, partner);
		user.receivePartner(partner);			
		
		if (privateRoom === undefined) {
			console.log('sal');
			privateRoom = Rooms.createPrivateRoom(user, partner);
			partner.receivePrivateMessageRequest(user.getName());
		} 
		
		Rooms.add(privateRoom);
		privateRoom.addUser(user);
	} else {
		Rooms.getByName(msg.currentRoom).addUser(user);
	}
}

function disconnect (msg, socket, io) {
	/*if (socket.id !== undefined) {
		let user = Users.getById(socket.id);
		user.disconnect();
		Users.onUserDisconnect(user);
	}*/
}

const ACTIONS = {
	LOGIN: login,
	USER_RENAME: userRename,
	GLOBAL_MESSAGE: chatMessage,
	DISCONNECT: disconnect,
	ROOM_CHANGE: roomChange
}

function actionMapper (channel, msg, socket, io) {
	ACTIONS[channel](msg, socket, io);
} 

module.exports = actionMapper;