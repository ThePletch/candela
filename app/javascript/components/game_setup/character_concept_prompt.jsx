import React from 'react'
import PropTypes from 'prop-types'

import CharacterConceptForm from './character_concept_form'

import SetupForm from './setup_form'

export default class CharacterConceptPrompt extends SetupForm {
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
            body: JSON.stringify({current_setup_state: 'character_concept'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    playersWithUnfilledConcept () {
        return this.props.participations.filter(this.playerWithConceptUnfilled);
    }

    playerWithConceptUnfilled(participant) {
        return participant.role == 'player' && participant.character_concept === null;
    }

    actions() {
        const unfilledConceptPlayers = this.playersWithUnfilledConcept();

        if (this.props.activeParticipant.role == 'gm' && unfilledConceptPlayers.length == 0) {
            return <button className="btn btn-primary" onClick={this.advanceStage.bind(this)}>Proceed to Moments</button>
        } else if (this.playerWithConceptUnfilled(this.props.activeParticipant)) {
            return <CharacterConceptForm participant={this.props.activeParticipant} />
        }
    }

    status() {
        const unfilledConceptPlayers = this.playersWithUnfilledConcept();

        if (unfilledConceptPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'player') {
                return <em>All character concepts submitted. Waiting for GM to continue...</em>;
            }
        } else {
            return (
                <ul>
                    {unfilledConceptPlayers.map(player => <li key={player.id}>{player.name} is writing their character concept...</li>)}
                </ul>
            );
        }
    }
};
