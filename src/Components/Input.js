import React, { Component } from 'react';

export default class Input extends Component {
	constructor() {
		super();
		this.state = {
			message: ''
		}
		this.setInputRef = el => {
			this.textInput = el;
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		this.textInput.focus();
	}

	handleInputChange(e) {
		this.setState({
			message: e.target.value
		})
	}

	sendMessage() {
		if (this.state.message !== '') {
			this.props.send(this.state.message);
			this.setState({
				message: ''
			})
		} else {
			alert('Stop that');
		}
	}

	render() {
		return (
			<div className = 'input-container'>
				<input 
					type="text" 
					placeholder="Your message here"
					value={this.state.message}
					ref={this.setInputRef}
					onChange={this.handleInputChange}
					onKeyPress = {(e) => {
						if (e.key === 'Enter') {
							this.sendMessage();
						}
					}}
				></input>
				<button onClick = {() => {
					this.sendMessage()
				}}>Send</button>
			</div>
		)
	}
} 