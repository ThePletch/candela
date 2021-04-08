import React from 'react'
import PropTypes from 'prop-types'

import MomentForm from './moment_form'


export default class MomentPrompt extends React.Component {
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
            body: JSON.stringify({current_setup_state: 'moments'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    playersWithUnfilledMoment () {
        return this.props.participations.filter(this.playerWithMomentUnfilled);
    }

    playerWithMomentUnfilled(participant) {
        return participant.role == 'player' && participant.moment === null;
    }

    render() {
        const unfilledMomentPlayers = this.playersWithUnfilledMoment();

        if (unfilledMomentPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'gm') {
              return <button onClick={this.advanceStage.bind(this)}>Proceed to Brinks</button>
            } else {
              return <em>Waiting for GM to continue...</em>;
            }
        } else {
            if (this.props.activeParticipant.role == 'gm' || !this.playerWithMomentUnfilled(this.props.activeParticipant)) {
                return (
                    <ul>
                        {unfilledMomentPlayers.map(player => <li key={player.id}>{player.name} is writing their moment...</li>)}
                    </ul>
                );
            } else {
                return <MomentForm participant={this.props.activeParticipant} />
            }
        }
    }
};
