const ROOM_NAME = {
	GLOBAL_1: 'global#1',
	GLOBAL_2: 'global#2',
	GLOBAL_3: 'global#3',
	PRIVATE: 'private',
}

const MESSAGE = {
	JOIN: 'user join',
	RENAME: 'user rename',
	LEAVE: 'user leave',
	DISCONNECT: 'user disconnect',
	ONLINE_USERS: 'online users',
	ROOM_CHANGE: 'room change',
	PUBLIC: 'chat message',
	PRIVATE_REQUEST: 'private message request',
	CHAT_HISTORY: 'chat history',
}

const CHAT_MESSAGE_TYPE = {
	OUTGOING: 'outgoing',
	INCOMING: 'incoming',
	STATUS_UPDATE: 'status update',
}

class User {
	constructor (name, socket) {
		this.name = name;
		this.socket = socket;
		this.id = socket.id;
		this.room = '';
		this.privatePartnerId = null;
	}

	getName () {
		return this.name;
	}

	getRoom () {
		return this.room;
	}

	getId () {
		return this.id;
	}

	getSocket () {
		return this.socket;
	}

	joinRoom (room, chatHistory) {
		this.room = room;
		this.socket.join(room);
		this.socket.emit(MESSAGE.CHAT_HISTORY, chatHistory);
		this.socket.broadcast.to(this.room).emit(MESSAGE.JOIN, this.name);
	}

	leaveRoom () {
		this.socket.leave(this.room);
		this.room = '';
	}

	receivePartner (user) {
		this.privatePartnerId = user.getId();
	}

	receivePrivateMessageRequest (username) {
		this.socket.emit(MESSAGE.PRIVATE_REQUEST, username);
		console.log(username);
	}

	newUserJoin (username) {
		this.socket.emit(MESSAGE.JOIN, username);
	}

	userLeave (username) {
		this.socket.emit(MESSAGE.LEAVE, username);
	}

	rename (newName) {
		this.socket.broadcast.to(this.room).emit(MESSAGE.RENAME, {
			prevUser: this.name,
			newUser: newName,
		});
		this.name = newName;
	}
	
	sendMessage (msg) {
		// msg.type = CHAT_MESSAGE_TYPE.INCOMING;
		this.socket.broadcast.to(this.room).emit(MESSAGE.PUBLIC, msg);
	}

	disconnect () {
		this.socket.broadcast.to(this.room).emit(MESSAGE.DISCONNECT, this.name);
	}
}

module.exports = User;