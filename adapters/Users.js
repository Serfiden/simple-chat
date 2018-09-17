class Users {
	constructor () {
		this.list = [];
	}

	toListOfNames () {
		return this.list.reduce((output, el) => {
			return output.concat(el.getName());
		}, []);
	}

	getByName (name) {
		return this.list.find(el => {
			return (el.getName() === name);
		})
	}

	addUser (user) {
		this.list.push(user);
	}

	removeUser (name) {
		let idx = this.list.indexOf(this.getByName(name));
		this.list.splice(idx, 1);
	}
}

module.exports = new Users();