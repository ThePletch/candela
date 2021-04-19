import React from 'react'
import PropTypes from 'prop-types'

import SetupForm from './setup_form'


export default class StartGamePrompt extends SetupForm {
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

    actions() {
        if (this.props.activeParticipant.role == 'gm' && this.props.participations.length >= 3) {
            return <button className='btn btn-primary' onClick={this.advanceStage.bind(this)}>Start the Game</button>
        }
    }

    status() {
        if (this.props.participations.length >= 3) {
            if (this.props.activeParticipant.role == 'player') {
                return <em>Waiting for GM to start game...</em>;
            }
        } else {
            const additionalNeededPlayers = 3 - this.props.participations.length;
            const persons = additionalNeededPlayers == 1 ? 'person' : 'people';
            return (<em>Waiting for {additionalNeededPlayers} more {persons}...</em>)
        }
    }
};
