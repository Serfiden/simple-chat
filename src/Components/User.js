import React, { Component } from 'react';

export default class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: true
		}
	}

	render() {
		return (
			<p className = 'user-row'>
				<span className = {(this.state.active ? 'active' : 'inactive') + ' status-bubble'}></span>
				{this.props.name}
			</p>
		)
	}
}