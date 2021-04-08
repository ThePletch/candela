import React from 'react'
import PropTypes from 'prop-types'

import CardOrderForm from './card_order_form'


export default class CardOrderPrompt extends React.Component {
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
            body: JSON.stringify({current_setup_state: 'order_cards'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    playersWithUnfilledCardOrder () {
        return this.props.participations.filter(this.playerWithCardOrderUnfilled);
    }

    playerWithCardOrderUnfilled(participant) {
        return participant.role == 'player' && participant.card_order === null;
    }

    render() {
        const unfilledCardOrderPlayers = this.playersWithUnfilledCardOrder();

        if (unfilledCardOrderPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'gm') {
              return <button onClick={this.advanceStage.bind(this)}>Begin the Game</button>
            } else {
              return <em>Waiting for GM to continue...</em>;
            }
        } else {
            if (this.props.activeParticipant.role == 'gm' || !this.playerWithCardOrderUnfilled(this.props.activeParticipant)) {
                return (
                    <ul>
                        {unfilledCardOrderPlayers.map(player => <li key={player.id}>{player.name} is ordering their cards...</li>)}
                    </ul>
                );
            } else {
                return <CardOrderForm participant={this.props.activeParticipant} />
            }
        }
    }
};
