import React from 'react'
import PropTypes from 'prop-types'


export default class SetupForm extends React.Component {
    advanceStage () {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify({current_setup_state: 'nascent'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    render() {
    	return (
    		<div className="fixed-bottom border-top">
                <h3>Game Setup</h3>
    			<div className="row">
    				<div className="col">
    					<h3>Actions</h3>
    					{this.actions()}
    				</div>
    				<div className="col">
    					<h3>Status</h3>
    					{this.status()}
    				</div>
    			</div>
    		</div>
    	)
    	if (this.props.participations.length >= 3) {
            if (this.props.activeParticipant.role == 'gm') {
    		  return <button className='btn btn-primary' onClick={this.advanceStage.bind(this)}>Start the Game</button>
            } else {
              return <em>Waiting for GM to start game...</em>;
            }
    	} else {
    		const additionalNeededPlayers = 3 - this.props.participations.length;
    		const persons = additionalNeededPlayers == 1 ? 'person' : 'people';
    		return (<em>Waiting for {additionalNeededPlayers} more {persons}...</em>)
    	}
    }
};
