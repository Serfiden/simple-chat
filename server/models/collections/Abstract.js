class Abstract {
	constructor () {
		this.list = [];
	}

	add (obj) {
		this.list.push(obj);
	}

	remove (obj) {
		this.list.splice(this.list.indexOf(obj), 1);
	}

	getByName (name) {
		return this.list.find(el => el.getName() === name);
	}

	getList () {
		return this.list;
	}
}

module.exports = Abstract;