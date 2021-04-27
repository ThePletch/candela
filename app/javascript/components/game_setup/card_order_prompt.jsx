import React from 'react'
import PropTypes from 'prop-types'

import CardOrderForm from './card_order_form'

import SetupForm from './setup_form'


export default class CardOrderPrompt extends SetupForm {
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

    actions() {
        const unfilledCardOrderPlayers = this.playersWithUnfilledCardOrder();

        if (unfilledCardOrderPlayers.length == 0 && this.props.activeParticipant.role == 'gm') {
            return <button className="btn btn-primary" onClick={this.advanceStage.bind(this)}>Begin the Game</button>
        }

        if (this.playerWithCardOrderUnfilled(this.props.activeParticipant)) {
            return <CardOrderForm participant={this.props.activeParticipant} />
        }
    }

    status() {
        const unfilledCardOrderPlayers = this.playersWithUnfilledCardOrder();

        if (unfilledCardOrderPlayers.length == 0) {
            if (this.props.activeParticipant.role == 'player') {
                return <em>All players have ordered their cards. Waiting for GM to continue...</em>;
            }
        } else {
            return (
                <ul>
                    {unfilledCardOrderPlayers.map(player => <li key={player.id}>{player.name} is ordering their cards...</li>)}
                </ul>
            );
        }
    }
};
