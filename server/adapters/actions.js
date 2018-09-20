const Users = require('../models/collections/Users.js');
const User = require('../models/User.js');

function login (msg, socket, io) {
	let newUser = new User(msg, socket);
	newUser.login();
	Users.addUser(newUser);
}

function userRename (msg, socket, io) {
	let user = Users.getByName(msg.prevUser);
	user.rename(msg.newUser);
}

function chatMessage (msg, socket, io) {
	Users.getById(socket.id).sendMessage(msg);
}

function privateMessage(msg, socket, io) {

}

function roomChange (msg, socket, io) {
	let user = Users.getById(socket.id);
	Users.onUserRoomChange(user, msg);
	user.changeRoom(msg);
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
	PRIVATE_MESSAGE: privateMessage,
	GLOBAL_MESSAGE: chatMessage,
	DISCONNECT: disconnect,
	ROOM_CHANGE: roomChange
}

function actionMapper (channel, msg, socket, io) {
	ACTIONS[channel](msg, socket, io);
} 

module.exports = actionMapper;