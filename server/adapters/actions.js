const User = require('../models/User.js');
const Users = require('../models/collections/Users.js');
const Rooms = require('../models/collections/Rooms.js');

const DEFAULT_ROOMS = [
	'global#1', 'global#2', 'global#3'
];

function login (msg, socket, io) {
	let newUser = new User(msg, socket);
	Rooms.getByName('global#1').addUser(newUser);
	Users.add(newUser);
}

function userRename (msg, socket, io) {
	let user = Users.getByName(msg.prevUser);
	let userPrivateRooms = Rooms.getUserPrivateRooms(user);
	let privatePartners = userPrivateRooms.reduce((acc, el) => {
		return acc.concat(el.getName().replace(' ', '').replace(user.getId(), ''));
	}, []);
	user.rename(msg.newUser, privatePartners);
	Rooms.getByName(user.getRoom()).userRename(msg.prevUser, msg.newUser);
	Rooms.getUserPrivateRooms(user).map(room => room.userRename(msg.prevUser, msg.newUser));
}

function chatMessage (msg, socket, io) {
	let sender = Users.getById(socket.id);
	let currentRoom = Rooms.getByName(sender.getRoom());
	sender.sendMessage(msg);
	currentRoom.addMessage(msg);
	if (DEFAULT_ROOMS.includes(sender.getRoom())) {
		Users.getList().filter(el => el.getName() !== sender.getName()).map(user => {
			user.receiveMessageNotification(sender.getRoom());
		})
	} else {
		let partner = Users.getById(sender.getRoom().replace(' ', '').replace(sender.getId(), ''));
		partner.receiveMessageNotification('PM: ' + sender.getName());
	}
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