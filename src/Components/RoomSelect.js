import React, { Component } from 'react';

const DEFAULT_ROOMS = [
  {
    name: 'Global chat #1',
    roomCode: 'global#1'
  },
  {
    name: 'Global chat #2',
    roomCode: 'global#2' 
  },
  {
    name: 'Global chat #3',
    roomCode: 'global#3'
  }
];

export default class RoomSelect extends Component {
	constructor (props) {
		super(props);
		this.state = {
			rooms: DEFAULT_ROOMS
		}
		this.connection = props.connection;
		this.setChatSelectRef = el => {
      		this.chatSelect = el;
    	}
		this.rooms = DEFAULT_ROOMS;
    	this.activeRoom = DEFAULT_ROOMS[0];

    	this.showDropdown = this.showDropdown.bind(this);
    	this.hideDropdown = this.hideDropdown.bind(this);
    	this.onChatRoomSelect = this.onChatRoomSelect.bind(this);
	}

	onChatRoomSelect(e, room) {
	    this.chatSelect.querySelectorAll('.chat-room-option').forEach(el => el.classList.remove('option-active'));
	    e.target.classList.add('option-active');

	    this.connection.emit('room change', {
	      	prevRoom: this.activeRoom.roomCode,
	        currentRoom: room.roomCode
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