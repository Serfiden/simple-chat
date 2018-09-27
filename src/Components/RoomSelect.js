import React, { Component } from 'react';

const DEFAULT_ROOMS = [
  {
    name: 'global#1',
    roomCode: 'global#1',
    newMessages: 0,
  },
  {
    name: 'global#2',
    roomCode: 'global#2',
  	newMessages: 0,
  },
  {
    name: 'global#3',
    roomCode: 'global#3',
  	newMessages: 0,
  }
];

export default class RoomSelect extends Component {
	constructor (props) {
		super(props);
		this.state = {
			rooms: JSON.parse(JSON.stringify(DEFAULT_ROOMS)),
			activeRoom: 'global#1',
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
		this.connection.on('message notification', (msg) => {
			this.onMessageNotification(msg);
		})
		this.connection.on('user rename', (msg) => {
			this.onUserRename(msg);
		});
		this.connection.on('user private rename', (msg) => {
			this.renamePrivateRooms(msg);
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
							newMessages: 0,
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
						newMessages: 0,
					})
				}
			})	
		}
	}

	onMessageNotification(msg) {
		if (this.state.activeRoom !== msg) {
			this.setState(prevState => {
				let rooms = prevState.rooms.slice(0, prevState.rooms.length);
				let idx = rooms.findIndex(el => el.name === msg);
				let messageNum = rooms[idx].newMessages + 1;
				rooms[idx].newMessages = messageNum;
				return rooms;
			});
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

	    this.setState(prevState => {
	    	let rooms = prevState.rooms.slice(0, prevState.rooms.length);
	    	rooms[rooms.findIndex(el => el.name === room.name)].newMessages = 0;

	    	return {
	    		rooms: rooms,
	    		activeRoom: room.name
	   		}
	   	});
  	}

  	onUserRename(msg) {
  		let idx = this.state.rooms.findIndex(el => el.name === 'PM: ' + msg.prevUser);

  		if (idx !== -1) {
  			this.setState(prevState => {
  				let rooms = prevState.rooms.slice(0, prevState.rooms.length);
  				rooms[idx].name = 'PM: ' + msg.newUser;
				let newActiveRoom = prevState.activeRoom === 'PM: ' + msg.prevUser ? 'PM: ' + msg.newUser : prevState.activeRoom;

  				return {
  					activeRoom: newActiveRoom,
  					rooms: rooms
  				};
  			});
  		}
  	}

  	renamePrivateRooms(msg) {
  		let roomsToChange = this.state.rooms.reduce((acc, el, idx) => {
  			if (el.name === ('PM: ' + msg.prevUser)) {
  				return acc.concat(idx);
  			}
  			return acc;
  		}, []);

  		console.log(roomsToChange);

  		if (roomsToChange !== undefined) {
	  		this.setState(prevState => {
	  			let rooms = prevState.rooms.slice(0, prevState.rooms.length);
	  			roomsToChange.map(roomIdx => {
	  				rooms[roomIdx].name = 'PM: ' + msg.newUser;
	  			});

	  			return {
	  				rooms: rooms,
	  			}
	  		});
	  	}
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
                    > {el.name} 
                    	{el.newMessages !== 0 &&
                    	<span class = "message-notification-box">
                    		{el.newMessages}	
                    	</span>
                    	}
                    </div>
                })
                }
              </div>
            </div>
		)
	}
}