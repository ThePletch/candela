import React from 'react'
import PropTypes from 'prop-types'

import SetupForm from './setup_form'
import TraitsForm from './traits_form'


export default class TraitsPrompt extends SetupForm {
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

    playerWithTraitsUnfilled (participant) {
        return participant.role == 'player' && (participant.written_virtue === null || participant.written_vice == null);
    }

    actions () {
        const unfilledTraitPlayers = this.playersWithUnfilledTraits();

        if (unfilledTraitPlayers.length == 0 && this.props.activeParticipant.role == 'gm') {
          return <button className="btn btn-primary" onClick={this.advanceStage.bind(this)}>Proceed to Scenario</button>;
        } else if (this.playerWithTraitsUnfilled(this.props.activeParticipant)) {
            return <TraitsForm participant={this.props.activeParticipant} participations={this.props.participations} />;
        } else {
            return (null);
        }
    }

    status() {
        const unfilledTraitPlayers = this.playersWithUnfilledTraits();

        if (unfilledTraitPlayers.length == 0 && this.props.activeParticipant.role !== 'gm') {
            return <em>Waiting for GM to continue...</em>;
        } else {
            return (
                <ul>
                    {unfilledTraitPlayers.map(player => <li key={player.id}>{player.name} is filling in traits...</li>)}
                </ul>
            );
        }
    }
};
