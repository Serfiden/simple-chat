import React, { Component } from 'react';

const DEFAULT_ROOMS = [
  {
    name: 'Global chat',
    roomCode: 'global#1',
    type: 'public',
  },
  {
    name: 'All fun and games',
    roomCode: 'global#2',
    type: 'public', 
  },
  {
    name: 'Dig bick energy',
    roomCode: 'global#3',
    type: 'public',
  }
];

export default class RoomSelect extends Component {
	constructor (props) {
		super(props);
		this.state = {
			rooms: JSON.parse(JSON.stringify(DEFAULT_ROOMS))
		}
		this.activeRoom = DEFAULT_ROOMS[0];
		this.connection = props.connection;
		this.setChatSelectRef = el => {
      		this.chatSelect = el;
    	}
    	this.showDropdown = this.showDropdown.bind(this);
    	this.hideDropdown = this.hideDropdown.bind(this);
    	this.onChatRoomSelect = this.onChatRoomSelect.bind(this);
	}

	componentDidMount() {
		this.connection.on('private message request', (msg) => {
			this.onPrivateMessageRequest(msg);
		});
		this.chatSelect.querySelectorAll('.chat-room-option')[0].classList.add('option-active');
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.privateReceiver !== this.props.privateReceiver) {
			this.setState(prevState => {
				return {
					rooms: prevState.rooms.concat({
						name: 'PM: ' + this.props.privateReceiver,
						roomCode: this.props.user + '-' + this.props.privateReceiver,
						type: 'private'
					})
				}
			});
		}
	}

	onPrivateMessageRequest(msg) {
		this.setState(prevState => {
			return {
				rooms: prevState.rooms.concat({
					name: 'PM: ' + msg,
					roomCode: msg + '-' + this.props.user,
					type: 'private'
				})
			}
		})
	}

	onChatRoomSelect(e, room) {
	    this.chatSelect.querySelectorAll('.chat-room-option').forEach(el => el.classList.remove('option-active'));
	    e.target.classList.add('option-active');
	
	   	this.connection.emit('room change', {
	 		prevRoom: this.activeRoom.roomCode,
        	currentRoom: room.roomCode,
        	type: room.type
   		});

	    this.activeRoom = room;
  	}

	showDropdown() {
	    this.chatSelect.querySelector('.select-arrow').style.animation = 'show-dropdown-arrow .1s forwards';
	    this.chatSelect.querySelector('.chat-room-dropdown-container').style.animation = 'show-dropdown forwards';
  	}

	hideDropdown() {
		this.chatSelect.querySelector('.select-arrow').style.animation = 'hide-dropdown-arrow .2s forwards';
		this.chatSelect.querySelector('.chat-room-dropdown-container').style.animation = 'hide-dropdown forwards';
	}

	render() {
		return (
			<div 
                className = 'chat-room-select-container' 
                ref = {this.setChatSelectRef}
                onMouseEnter = {this.showDropdown}
                onMouseLeave = {this.hideDropdown}>
              <div className = 'chat-room-select'>
                Select a chat room
                <div className = 'select-arrow'>
                </div>
              </div>
              <div className = 'chat-room-dropdown-container'>
                {this.state.rooms.map(el => {
                  return <div 
                    className = 'chat-room-option'
                    onClick = {(e) => {
                    	if (el !== this.activeRoom)
                      		this.onChatRoomSelect(e, el);  
                    }}
                    > {el.name} </div>
                })
                }
              </div>
            </div>
		)
	}
}