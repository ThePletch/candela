import React from 'react'
import PropTypes from 'prop-types'

import TraitsForm from './traits_form'


export default class TraitsPrompt extends React.Component {
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
            body: JSON.stringify({current_setup_state: 'traits'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    playersWithUnfilledTraits () {
        return this.props.participations.filter(this.playerWithTraitsUnfilled);
    }

    playerWithTraitsUnfilled(participant) {
        return participant.role == 'player' && (participant.written_virtue === null || participant.written_vice == null);
    }

    render() {
        const unfilledTraitPlayers = this.playersWithUnfilledTraits();

        if (unfilledTraitPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'gm') {
              return <button onClick={this.advanceStage.bind(this)}>Proceed to Scenario</button>
            } else {
              return <em>Waiting for GM to continue...</em>;
            }
        } else {
            if (this.props.activeParticipant.role == 'gm' || !this.playerWithTraitsUnfilled(this.props.activeParticipant)) {
                return (
                    <ul>
                        {unfilledTraitPlayers.map(player => <li key={player.id}>{player.name} is filling in traits...</li>)}
                    </ul>
                );
            } else {
                return <TraitsForm participant={this.props.activeParticipant} />
            }
        }
    }
};
