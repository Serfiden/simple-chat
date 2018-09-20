import React, { Component } from 'react';
import PrivateMessageContext from './PrivateMessageContext.js';

export default class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: true
		}
	}

	render() {
		return (
			<PrivateMessageContext.Consumer>
			{({createPrivateRoom}) => ( 
				<p className = 'user-row' onClick = {e => {createPrivateRoom(e.target.innerText)}}>
					<span className = {(this.state.active ? 'active' : 'inactive') + ' status-bubble'}></span>
					{this.props.name}
				</p>
			)}
			</PrivateMessageContext.Consumer>
		)
	}
}