import React from 'react';

function parseDate (arg) {
	let date = new Date(arg);
	let hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
	let minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
	return (hours + ':' + minutes);
}

const TYPE = {
	OUTGOING: 'outgoing',
	INCOMING: 'incoming',
	STATUS_UPDATE: 'status update',
	USER_RENAME: 'user rename',
	TYPING: 'typing',
}

function StatusUpdate (props) {
	return <p> {props.user + props.content} </p>
}

function Incoming (props) {
	return (
		<div className = 'message-row'>
			<div className = "out-message message-box" >
				<div className = 'message-sender-box'>
					{props.user}						
				</div>
				<div className = 'message-text'>
					{props.content}
				</div>
				<div className = 'message-date-box'>
					{parseDate(props.time)}
				</div>
			</div>
		</div>
	)	
}

function Outgoing (props) {
	return (
		<div className = 'message-row'>
			<div className = "own-message message-box" >
				<div className = 'message-text'>
					{props.content}
				</div>
				<div className = 'message-date-box'>
					{parseDate(props.time)}
				</div>
			</div>
		</div>
	)
}

function UserRename (props) {
	return <p> {props.user + props.content} </p>
}

function Typing (props) {
	return <p style = {{'font-style':'italic'}}> {props.user + ' is typing'} </p>
}

const MAPPING = {
	[TYPE.STATUS_UPDATE]: StatusUpdate,
	[TYPE.INCOMING]: Incoming,
	[TYPE.OUTGOING]: Outgoing,
	[TYPE.USER_RENAME]: UserRename,
	[TYPE.TYPING]: Typing, 
}

function MessageGenerator(type, data) {
	return MAPPING[type](data);
}

export default MessageGenerator;