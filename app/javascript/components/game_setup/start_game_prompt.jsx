import React from 'react'
import PropTypes from 'prop-types'


export default class StartGamePrompt extends React.Component {
    static propTypes = {
        participations: PropTypes.array.isRequired,
        gameId: PropTypes.number.isRequired,
        activeParticipant: PropTypes.object,
    }
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
    	if (this.props.participations.length >= 3) {
            if (this.props.activeParticipant.role == 'gm') {
    		  return <button onClick={this.advanceStage.bind(this)}>Start the Game</button>
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
