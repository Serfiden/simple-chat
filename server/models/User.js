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

	login () {
		this.room = ROOM_NAME.GLOBAL_1;
		this.socket.join(ROOM_NAME.GLOBAL_1);
		this.socket.broadcast.to(ROOM_NAME.GLOBAL_1).emit(MESSAGE.JOIN, this.name);
	}

	receiveOnlineUsers (roomUsersNames) {
		this.socket.emit(MESSAGE.ONLINE_USERS, roomUsersNames);
	}

	receivePartner (user) {
		this.privatePartnerId = user.getId();
	}

	rename (newName) {
		this.socket.broadcast.to(this.room).emit(MESSAGE.RENAME, {
			prevUser: this.name,
			newUser: newName,
		});
		this.name = newName;
	}
	
	sendMessage (msg) {
		msg.type = CHAT_MESSAGE_TYPE.INCOMING;
		if (this.room === ROOM_NAME.PRIVATE) {
			this.socket.broadcast.to(this.privatePartnerId).emit(MESSAGE.PUBLIC, msg);
		} else {
			this.socket.broadcast.to(this.room).emit(MESSAGE.PUBLIC, msg);
		}
	}

	changeRoom (msg) {
		let room = msg.currentRoom;
		
		if (this.room !== 'PRIVATE') {
			this.socket.broadcast.to(this.room).emit(MESSAGE.LEAVE, this.name);
		}
		this.socket.leave(this.room);

		this.socket.join(room);
		this.room = room;
		
		if (room !== 'PRIVATE') {
			this.socket.broadcast.to(room).emit(MESSAGE.JOIN, this.name);
		} else {
			console.log(this.privatePartnerId);
			this.socket.broadcast.to(this.privatePartnerId).emit(MESSAGE.PRIVATE_REQUEST, this.name);
		}
	}

	disconnect () {
		this.socket.broadcast.to(this.room).emit(MESSAGE.DISCONNECT, this.name);
	}
}

module.exports = User;