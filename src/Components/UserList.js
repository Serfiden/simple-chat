import React, { Component } from 'react';
import User from './User.js';

const MAPPINGS = (ctx) => {
	return {
		'online users': ctx.showOnlineUsers,
		'user connect': ctx.userConnect,
		'user disconnect': ctx.userDisconnect,
		'user rename': ctx.userRename
	}
}

export default class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: []
		}
		this.socket = props.connection;
		this.showOnlineUsers = this.showOnlineUsers.bind(this);
		this.userConnect = this.userConnect.bind(this);
		this.userDisconnect = this.userDisconnect.bind(this);
		this.userRename = this.userRename.bind(this);
	}

	componentDidMount() {
		for (let key in MAPPINGS(this)) {
			this.socket.on(key, (msg) => {
				MAPPINGS(this)[key](msg);
			})
		}
	}

	showOnlineUsers(users) {
		this.setState({
			users: users
		});
	}

	userConnect(user) {
		this.setState((prevState) => {
			let connectedUsers = prevState.users.concat(user);
			return {
				users: connectedUsers
			}
		});
	}

	userDisconnect(user) {
		this.setState((prevState) => {
			let connectedUsers = prevState.users.concat();
			connectedUsers.splice(connectedUsers.indexOf(user), 1);
			return {
				users: connectedUsers
			}
		})
	}

	userRename(msg) {
		this.setState(prevState => {
			let users = JSON.parse(JSON.stringify(prevState.users));
			users[users.indexOf(msg.prevUser)] = msg.newUser;
			return {
				users: users
			}
		})
	}

	render() {
		return (
			<div className = 'users-list-container'>
				{this.state.users.map((user) => <User name = {user} />)}
			</div>
		)
	}
}