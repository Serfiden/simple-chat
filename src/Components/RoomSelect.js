import React, { Component } from 'react';

const DEFAULT_ROOMS = [
  {
    name: 'Global chat',
    roomCode: 'global#1',
  },
  {
    name: 'All fun and games',
    roomCode: 'global#2',
  },
  {
    name: 'Fairy dust',
    roomCode: 'global#3',
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
			if (this.state.rooms.find(el => el.name === ('PM: ' + this.props.privateReceiver)) === undefined)
				this.setState(prevState => {
					return {
						rooms: prevState.rooms.concat({
							name: 'PM: ' + this.props.privateReceiver,
							roomCode: 'PRIVATE',
						})
					}
				});
		}
	}

	onPrivateMessageRequest(msg) {
		if (this.state.rooms.find(el => el.name === ('PM: ' + msg)) === undefined) {
			this.setState(prevState => {
				return {
					rooms: prevState.rooms.concat({
						name: 'PM: ' + msg,
						roomCode: 'PRIVATE',
					})
				}
			})	
		}
	}

	onChatRoomSelect(e, room) {
	    this.chatSelect.querySelectorAll('.chat-room-option').forEach(el => el.classList.remove('option-active'));
	    e.target.classList.add('option-active');

		if (room.roomCode === 'PRIVATE') {
			this.connection.emit('room change', {
				currentRoom: 'PRIVATE',
				roomPartner: room.name.replace('PM: ', '')
			})
		} else {
			this.connection.emit('room change', {
        		currentRoom: room.roomCode,
   			});
		}

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