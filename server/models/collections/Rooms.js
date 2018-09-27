const Abstract = require('./Abstract.js');
const Room = require('../Room.js');

class Rooms extends Abstract {
	constructor () {
		super();
	}

	init() {
		this.list = [
			new Room('global#1', 'PUBLIC'),
			new Room('global#2', 'PUBLIC'),
			new Room('global#3', 'PUBLIC'),
		];
		return this;
	}

	createPrivateRoom (user1, user2) {
		return new Room(user1.getId() + ' ' + user2.getId(), 'PRIVATE');
	}

	getPrivateRoom (user1, user2) {
		return this.list.find(el => el.getName().includes(user1.getId()) && el.getName().includes(user2.getId()));
	}

	getUserPrivateRooms(user) {
		return this.list.filter(el => el.getName().includes(user.getId()));
	}
}

module.exports = new Rooms().init();