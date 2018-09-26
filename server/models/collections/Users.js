const Abstract = require('./Abstract.js');
const User = require('../User.js');

class Users extends Abstract {
	constructor () {
		super();
	}

	getById (id) {
		return this.list.find(el => el.getId() === id)
	}
}

module.exports = new Users();