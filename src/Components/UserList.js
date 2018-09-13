import React, { Component } from 'react';
import User from './User.js';

const MAPPINGS = (ctx) => {
	return {
		'online users': ctx.showOnlineUsers,
		'user connect': ctx.userConnect,
		'user disconnect': ctx.userDisconnect
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
		this.init();
	}

	init() {
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
			let connectedUsers = prevState.users;
			connectedUsers.push(user);
			return {
				users: connectedUsers
			}
		});
	}

	userDisconnect(user) {
		this.setState((prevState) => {
			let connectedUsers = prevState.users;
			connectedUsers.splice(connectedUsers.indexOf(user), 1);
			return {
				users: connectedUsers
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