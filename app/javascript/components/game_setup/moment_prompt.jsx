import React from 'react'
import PropTypes from 'prop-types'

import MomentForm from './moment_form'

import SetupForm from './setup_form'

export default class MomentPrompt extends SetupForm {
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

    actions() {
        const unfilledMomentPlayers = this.playersWithUnfilledMoment();

        if (unfilledMomentPlayers.length == 0 && this.props.activeParticipant.role == 'gm') {
            return <button className='btn btn-primary' onClick={this.advanceStage.bind(this)}>Proceed to Brinks</button>
        } else if (this.playerWithMomentUnfilled(this.props.activeParticipant)) {
            return <MomentForm participant={this.props.activeParticipant} />
        }
    }

    status() {
        const unfilledMomentPlayers = this.playersWithUnfilledMoment();

        if (unfilledMomentPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'player') {
                return <em>All moments submitted. Waiting for GM to continue...</em>;
            }
        } else {
            return (
                <ul>
                    {unfilledMomentPlayers.map(player => <li key={player.id}>{player.name} is writing their moment...</li>)}
                </ul>
            );
        }
    }
};
