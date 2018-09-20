const User = require('../User.js');

const ROOM_NAME = {
	GLOBAL_1: 'global#1',
	GLOBAL_2: 'global#2',
	GLOBAL_3: 'global#3',
	PRIVATE: 'PRIVATE',
}

class Users {
	constructor () {
		this.list = [];
	}

	addUser (user) {
		user.receiveOnlineUsers(this.getByRoom(ROOM_NAME.GLOBAL_1));
		this.list.push(user);
	}

	getNames () {
		return this.list.map(el => el.getName());
	}

	getByRoom (room) {
		let roomUsers = this.list.filter(el => el.getRoom() === room);
		return roomUsers.map(el => el.getName());
	}

	getById (id) {
		return this.list.find(el => el.getId() === id)
	}

	getByName (name) {
		return this.list.find(el => el.getName() === name);
	}

	onUserRoomChange (user, msg) {
		let room = msg.currentRoom;
		console.log(msg);
		if (room !== ROOM_NAME.PRIVATE) 
			user.receiveOnlineUsers(this.getByRoom(room));
		else {
			console.log(msg.roomPartner);
			user.receivePartner(this.getByName(msg.roomPartner));
		}
	}

	onUserDisconnect (user) {
		let index = this.list.indexOf(user);
		this.list.splice(index, 1);
	}

	onPrivateMessage (msg) {

	}
}

module.exports = new Users();