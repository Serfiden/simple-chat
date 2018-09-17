class User {
	constructor (name, socket) {
		this.name = name;
		this.socket = socket;
	}

	getName () {
		return this.name;
	}

	getSocket () {
		return this.socket;
	}

	sendGlobalMessage(msg) {
		
	}

	login (users) {
		this.socket.broadcast.emit('user connect', this.name);
		this.socket.emit('online users', users);
	}
}

module.exports = User;