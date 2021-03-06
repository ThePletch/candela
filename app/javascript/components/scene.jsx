import React from 'react';
import Conflict from './conflict'
import TruthsList from './truths_list'

import { makePatchRequest, makePostRequest } from 'util/requests';

class TruthsPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            truthToState: ''
        }
    }

    setDesiredTruth(event) {
        this.setState({truthToState: event.target.value});
    }

    createTruth(event) {
        event.preventDefault();

        makePostRequest(
            `/api/scenes/${this.props.scene.id}/truths`,
            this.props.activeParticipant.guid,
            {
                description: this.state.truthToState,
            }
        );
    }

    render () {
        if (this.props.scene.state == 'transitioning') {
            if (this.props.scene.next_truth_stater_id === this.props.activeParticipant.id) {
                return (<form onSubmit={this.createTruth.bind(this)}>
                    <textarea className="form-control" name="description" onChange={this.setDesiredTruth.bind(this)} />
                    <input className="btn btn-primary" type="submit" value="State Truth" />
                    <br />
                    <em>{this.props.scene.truths_remaining} truths remain to be stated.</em>
                </form>)
            } else {
                return (<div>
                    <em>Waiting for {this.props.scene.next_truth_stater_name} to state a truth.</em>
                    <br />
                    <em>{this.props.scene.truths_remaining} truths remain to be stated.</em>
                </div>);
            }
        } else {
            return (null);
        }
    }
}


class ConflictHandler extends React.Component {
    createConflict(dire) {
        makePostRequest(
            `/api/scenes/${this.props.scene.id}/conflicts`,
            this.props.activeParticipant.guid,
            {dire: dire}
        );
    }

    createUndireConflict() {
        this.createConflict(false);
    }

    createDireConflict() {
        this.createConflict(true);
    }

    render () {
        if (this.props.scene.state == 'truths_stated') {
            if (!this.props.scene.active_conflict) {
                if (this.props.activeParticipant.role === 'gm') {
                    return (
                        <div>
                            <h3>Click one of the below buttons to begin a conflict.</h3>
                            <button className="btn btn-primary" onClick={this.createUndireConflict.bind(this)}>CONFLICT</button>
                            <button className="btn btn-danger" onClick={this.createDireConflict.bind(this)}>DIRE CONFLICT</button>
                        </div>
                    );
                } else {
                    return (<div>
                        <h3>The scene is underway.</h3>
                        <em>When a conflict occurs, you will see it here.</em>
                    </div>);
                }
            } else {
                return (<Conflict
                    conflict={this.props.scene.active_conflict}
                    activeParticipant={this.props.activeParticipant}
                    gameId={this.props.gameId} />);
            }
        } else {
            return (null);
        }
    }
}


export default class Scene extends React.Component {
    render() {
        return (
            <div>
                <TruthsList truths={this.props.scene.truths} truthsRemaining={this.props.scene.truths_remaining} />
                <TruthsPrompt {...this.props} />
                <ConflictHandler {...this.props} />
            </div>
        );
    }
};
