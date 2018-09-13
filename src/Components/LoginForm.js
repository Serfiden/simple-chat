import React, { Component } from 'react';

export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: ''
		}
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(e) {
    	this.setState({
      		user: e.target.value
    	})
  	}

	render() {
		return (
			<div> 
          		<label> Your username goes here: </label>
          		<input 
          			type="text" 
          			value = {this.state.user} 
          			onChange={this.handleInputChange} 
          			onKeyPress={(e) => {
          				if(e.key === 'Enter')
            				this.props.submit(this.state.user);
        		}}>
        		</input>
        		<button onClick={() => {
          			this.props.submit(this.state.user);
        		}}> Login </button>
        	</div>
        )

	}
}