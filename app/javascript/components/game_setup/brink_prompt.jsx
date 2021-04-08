import React from 'react'
import PropTypes from 'prop-types'

import BrinkForm from './brink_form'


export default class BrinkPrompt extends React.Component {
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
            body: JSON.stringify({current_setup_state: 'brinks'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    playersWithUnfilledBrink () {
        return this.props.participations.filter(this.playerWithBrinkUnfilled);
    }

    playerWithBrinkUnfilled(participant) {
        return participant.written_brink === null;
    }

    render() {
        const unfilledBrinkPlayers = this.playersWithUnfilledBrink();

        if (unfilledBrinkPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'gm') {
              return <button onClick={this.advanceStage.bind(this)}>Proceed to Card Order</button>
            } else {
              return <em>Waiting for GM to continue...</em>;
            }
        } else {
            if (!this.playerWithBrinkUnfilled(this.props.activeParticipant)) {
                return (
                    <ul>
                        {unfilledBrinkPlayers.map(player => <li key={player.id}>{player.name} is writing their brink...</li>)}
                    </ul>
                );
            } else {
                return <BrinkForm participant={this.props.activeParticipant} />
            }
        }
    }
};
