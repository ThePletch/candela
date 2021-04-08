import React from 'react';

import { createCableStateManager, listStateReducer } from 'util/cable_tracker'
import { makePatchRequest, makePostRequest } from 'util/requests';

function Die(props) {
    let color;
    if (props.hopeDie) {
        color = ["5", "6"].includes(props.roll) ? 'badge-info' : 'badge-primary';
    } else {
        color = props.roll == "6" ? 'badge-success': 'badge-secondary';
    }

    return (<span className={`badge ${color}`}>{props.roll}</span>);
}


class BurnTraitButton extends React.Component {
    burnTrait() {
        makePostRequest(
            `/api/conflicts/${this.props.conflict.id}/resolutions/`,
            this.props.activeParticipant.guid,
            {
                type: 'TraitResolution',
                resolution_id: this.props.resolution.id,
                burned_trait_type: this.props.activeParticipant.top_trait_id,
            }
        )
    }

    canBurnTrait() {
        return ["virtue", "vice"].includes(this.props.activeParticipant.top_trait)
            && this.props.resolution.player_roll_result.includes('1');
    }

    render() {
        if (this.canBurnTrait()) {
            if (this.props.resolution.is_override) {
                return (
                    <button className="btn btn-primary" disabled="disabled">You cannot burn your {this.props.activeParticipant.top_trait}. This result is final.</button>
                );
            } else {
                return (
                    <button className="btn btn-primary" onClick={this.burnTrait.bind(this)}>
                        Burn your {this.props.activeParticipant.top_trait} ({this.props.activeParticipant.top_trait_value})
                    </button>
                );
            }
        } else {
            return (null);
        }
    }
}


class EmbraceBrinkButton extends React.Component {
    embraceBrink() {
        makePostRequest(
            `/api/conflicts/${this.props.conflict.id}/resolutions/`,
            this.props.activeParticipant.guid,
            {
                type: 'BrinkResolution',
                resolution_id: this.props.resolution.id,
            }
        );
    }

    canEmbraceBrink() {
        return this.props.activeParticipant.top_trait == 'brink'
            && (!this.props.resolution.failed
                || this.props.resolution.narrative_control != this.props.activeParticipant.name)
    }

    render() {
        if (this.canEmbraceBrink()) {
            if (this.props.resolution.is_override) {
                return (
                    <button className="btn btn-primary" disabled="disabled">You cannot embrace your brink. This result is final.</button>
                );
            } else {
                return (
                    <button className="btn btn-primary" onClick={this.embraceBrink.bind(this)}>
                        Embrace your brink ({this.props.activeParticipant.top_trait_value})
                    </button>
                );
            }
        } else {
            return (null);
        }
    }
}


class ConfirmResultButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beneficiary: null,
            participations: []
        }
    }

    componentDidMount() {
        this.participantsChannelSubscription = createCableStateManager('ParticipantsChannel', {
            game_id: this.props.gameId,
            guid: this.props.activeParticipant.guid,
        }, receivedData => {
            this.setState({participations: listStateReducer(this.state.participations, receivedData)});
        });
    }

    componentWillUnmount() {
        this.participantsChannelSubscription.unsubscribe();
    }

    confirm() {
        let body = {};

        if (this.state.beneficiary) {
            body.beneficiary_player_id = this.state.beneficiary;
        }

        makePatchRequest(
            `/api/resolutions/${this.props.resolution.id}/confirm`,
            this.props.activeParticipant.guid,
            body
        );
    }

    changeBeneficiary(event) {
        this.setState({beneficiary: event.target.value})
    }

    playerWillDie() {
        return !this.props.resolution.successful && this.props.conflict.dire
    }

    render() {
        if (this.playerWillDie() && this.props.activeParticipant.hope_die_count > 0 && this.props.resolution.type == 'MartyrResolution') {
            const isValidRecipient = function(participant) {
                return participant.id != this.props.activeParticipant.id && participant.role != 'gm'
            }.bind(this);

            return (
                <div>
                    <select disabled={this.state.participations.length == 0} onChange={this.changeBeneficiary.bind(this)}>
                        <option disabled={this.state.participations.length > 0}>{
                            this.state.participations.length == 0
                            ? "Loading hope die recipients..."
                            : "Choose who will receive your hope die."}</option>
                        {this.state.participations.filter(isValidRecipient).map(participant => <option key={participant.id} value={participant.id}>{participant.name}</option>)}
                    </select>
                    <button className="btn btn-primary" onClick={this.confirm.bind(this)} disabled={this.state.beneficiary == null}>Confirm Result</button>
                </div>
            );
        } else {
            return (<button className="btn btn-primary" onClick={this.confirm.bind(this)}>Confirm Result</button>);
        }
    }
}


class ResolutionAcceptanceOptions extends React.Component {

    martyr() {
        // todo handle hope die beneficiary designation

        makePostRequest(
            `/api/conflicts/${this.props.conflict.id}/resolutions/`,
            this.props.activeParticipant.guid,
            {
                type: 'MartyrResolution',
                resolution_id: this.props.resolution.id,
            }
        );
    }

    render() {
        if (this.props.activeParticipant.id == this.props.resolution.active_player_id) {
            return (
                <div>
                    <ConfirmResultButton {...this.props} />
                    <BurnTraitButton {...this.props} />
                    <EmbraceBrinkButton {...this.props} />
                </div>
            );
        } else if (this.props.conflict.dire && !this.props.resolution.successful && !this.props.resolution.is_override) {
            return (
                <div>
                    <button className="btn btn-primary" onClick={this.martyr.bind(this)}>Martyr yourself to save {this.props.resolution.active_player}</button>
                </div>
            );
        } else {
            return (<em>Waiting for {this.props.resolution.active_player} to resolve this conflict.</em>);
        }
    }
}

export default class Resolution extends React.Component {
    render() {
        return (<div>
            <h3>Conflict results</h3>
            <ul>
                <li>Active player was {this.props.resolution.active_player}</li>
                <li>PLAYER: {this.props.resolution.player_roll_result.split("").map((roll, i) => <Die key={"player-" + i} hopeDie={i <= this.props.resolution.hope_die_count} roll={roll} />)}</li>
                <li>GM: {this.props.resolution.gm_roll_result.split("").map((roll, i) => <Die hopeDie={false} roll={roll} />)}</li>
                <li>{this.props.resolution.successful ? "Succeeded" : "Failed"}</li>
                <li>Narrative control will go to {this.props.resolution.narrative_control}</li>
            </ul>
            <ResolutionAcceptanceOptions {...this.props} />
        </div>);
    }
}
