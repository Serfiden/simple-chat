const MESSAGE = {
	JOIN: 'user join',
	RENAME: 'user rename',
	LEAVE: 'user leave',
	ONLINE_USERS: 'online users',
	MESSAGE_NOTIFICATION: 'message notification'
}

class Room {
	constructor (name, type) {
		this.type = type;
		this.name = name;
		this.users = [];
		this.messages = [];
	}

	addUser (user) {
		user.joinRoom(this.name, this.messages);
		user.getSocket().emit(MESSAGE.ONLINE_USERS, this.users);
		this.users.push(user.getName());
	}

	removeUser (user) {
		user.leaveRoom(this.name);
		user.getSocket().broadcast.to(this.name).emit(MESSAGE.LEAVE, user.getName());
		this.users.splice(this.users.indexOf(user.getName()), 1);
	}

	getUserNames () {
		return this.users.reduce((res, el) => {
			return res.concat(el.getName());
		}, []);
	}

	userRename (prevName, newName) {
		this.users[this.users.indexOf(prevName)] = newName;
		this.messages.filter(msg => msg.user === prevName).map(msg => msg.user = newName);
	}

	getName () {
		return this.name;
	}

	getUsers() {
		return this.users;
	}

	getMessages() {
		return this.messages;
	}

	addMessage (msg) {
		this.messages.push(msg);
	}

}

module.exports = Room;