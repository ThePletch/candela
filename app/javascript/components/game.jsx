// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import _ from 'lodash'
import Candle from './candle'
import ParticipationsList from './participations_list'
import StartGamePrompt from './game_setup/start_game_prompt'
import TraitsPrompt from './game_setup/traits_prompt'
import ModuleIntroPrompt from './game_setup/module_intro_prompt'
import CharacterConceptPrompt from './game_setup/character_concept_prompt'
import MomentPrompt from './game_setup/moment_prompt'
import BrinkPrompt from './game_setup/brink_prompt'
import CardOrderPrompt from './game_setup/card_order_prompt'
import Scene from './scene'

import { createCableStateManager, listStateReducer } from 'util/cable_tracker'


class Game extends Component {
    static propTypes = {
        participantGuid: PropTypes.string.isRequired,
        participantId: PropTypes.number.isRequired,
        gameId: PropTypes.number.isRequired,
    }

    constructor(props){
        super(props);
        this.state = {
            game: null,
            participations: []
        };
    }

    componentDidMount() {
        this.gameChannelSubscription = createCableStateManager('GameChannel', {
            id: this.props.gameId,
            guid: this.props.participantGuid,
        }, receivedData => {
            this.setState({game: receivedData});
        });

        this.participantsChannelSubscription = createCableStateManager('ParticipantsChannel', {
            game_id: this.props.gameId,
            guid: this.props.participantGuid,
        }, receivedData => {
            this.setState({participations: listStateReducer(this.state.participations, receivedData)});
        });
    }

    componentWillUnmount() {
        this.gameChannelSubscription.unsubscribe();
        this.participantsChannelSubscription.unsubscribe();
    }

    activeParticipant() {
        if (this.state.participations) {
            const participant = this.state.participations.find(participation => participation.id == this.props.participantId);
            if (participant) {
                participant.guid = this.props.participantGuid;

                return participant;
            }
        }
    }

    dicePoolIndicator() {
        if (this.state.game.active_scene) {
            return (<div>{_.times(this.state.game.active_scene.base_player_dice_pool, n => { return (<span key={`pool-${n}`} className="badge badge-pill badge-info">&nbsp;</span>)})}</div>);
        }

        return (null);
    }

    currentSetupStatePrompt() {
        const activeParticipant = this.activeParticipant();
        if (!activeParticipant){
            return (<em>Loading...</em>);
        }

        if (this.state.game.is_over) {
            return (<div>
                <em>These things are true...</em>
                <br/>
                <strong>The world is dark.</strong>
                <br/>
                <br/>
                <small>Thank you for playing.</small>
            </div>);
        }

        switch (this.state.game.setup_state) {
            case 'nascent':
                return (<StartGamePrompt participations={this.state.participations} gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'traits':
                return (<TraitsPrompt participations={this.state.participations} gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'module_intro':
                return (<ModuleIntroPrompt gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'character_concept':
                return (<CharacterConceptPrompt participations={this.state.participations} gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'moments':
                return (<MomentPrompt participations={this.state.participations} gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'brinks':
                return (<BrinkPrompt participations={this.state.participations} gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'order_cards':
                return (<CardOrderPrompt participations={this.state.participations} gameId={this.props.gameId} activeParticipant={activeParticipant} />);
            case 'ready':
                return (<Scene scene={this.state.game.active_scene} game={this.state.game} activeParticipant={activeParticipant} gameId={this.props.gameId} />);
        }
    }

    render() {
        if (!this.state.game) { return (<p>Loading Game...</p>); }
        return (
            <div className="container-fluid">
                <h1>{this.state.game.name}</h1>
                <div className="row">
                    <div className="col">
                        <h6>Candles Lit</h6>
                        <div>{_.times(10, n => { return (<Candle key={n} lit={n < this.state.game.candles_lit} />) })}</div>
                        <h6>Dice In Pool</h6>
                        {this.dicePoolIndicator()}
                        <div>{this.currentSetupStatePrompt()}</div>
                    </div>
                    <div className="col" style={{flexGrow: "2"}}>
                        <ParticipationsList participations={this.state.participations} activeParticipant={this.props.participantId} game={this.state.game} />
                    </div>
                </div>
            </div>);
    }
};

export default Game;
