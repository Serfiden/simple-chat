import React, { Component } from 'react';

export default class Message extends Component {
	constructor(props) {
		super(props);
		this.parseDate = this.parseDate.bind(this);
	}

	parseDate() {
		let date = new Date(this.props.data.time);
		return (date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
	}

	render() {
		return (
			<div className = 'message-row'>
				<div className = {(this.props.src === "in" ? "own-message" : "out-message") + " message-box"} >
					<div className = 'message-sender-box'>
						{this.props.data.user} said
					</div>
					<div className = 'message-text'>
						{this.props.data.content}
					</div>
					<div className = 'date-box'>
						at {this.parseDate()}
					</div>
				</div>
			</div>
		)
	}
}