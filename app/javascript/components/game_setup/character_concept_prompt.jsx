import React from 'react'
import PropTypes from 'prop-types'

import CharacterConceptForm from './character_concept_form'


export default class CharacterConceptPrompt extends React.Component {
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

    render() {
        const unfilledConceptPlayers = this.playersWithUnfilledConcept();

        if (unfilledConceptPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'gm') {
              return <button onClick={this.advanceStage.bind(this)}>Proceed to Moments</button>
            } else {
              return <em>Waiting for GM to continue...</em>;
            }
        } else {
            if (this.props.activeParticipant.role == 'gm' || !this.playerWithConceptUnfilled(this.props.activeParticipant)) {
                return (
                    <ul>
                        {unfilledConceptPlayers.map(player => <li key={player.id}>{player.name} is writing their character concept...</li>)}
                    </ul>
                );
            } else {
                return <CharacterConceptForm participant={this.props.activeParticipant} />
            }
        }
    }
};
