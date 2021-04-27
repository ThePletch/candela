import React from 'react';

import Resolution from './resolution';
import { makePatchRequest, makePostRequest } from 'util/requests';


class PlayerConflictOptions extends React.Component {
    rollForConflict() {
        makePostRequest(
            `/api/conflicts/${this.props.conflict.id}/resolutions`,
            this.props.activeParticipant.guid,
            {
                type: 'RollResolution',
            }
        )
    }

    liveMoment() {
        makePostRequest(
            `/api/conflicts/${this.props.conflict.id}/resolutions`,
            this.props.activeParticipant.guid,
            {
                type: 'MomentResolution',
            }
        )
    }

    liveMomentButton() {
        if (this.props.activeParticipant.top_trait == 'moment') {
            return <button className="btn btn-primary" onClick={this.liveMoment.bind(this)}>Live Moment</button>
        }

        return (null);
    }

    direConflictWarning() {
        if (this.props.conflict.dire) {
            return (<strong>This is a dire conflict, and whoever rolls for it will die if they fail.</strong>);
        }

        return (null);
    }


    render() {
        if (this.props.activeParticipant.is_alive) {
            return (
                <div>
                    <h3>The GM has finished describing the conflict.</h3>
                    <p>If your character will face this conflict, click the button below.</p>
                    {this.direConflictWarning()}
                    <button className="btn btn-primary" onClick={this.rollForConflict.bind(this)}>Roll</button>
                    {this.liveMomentButton()}
                </div>
            )
        } else {
            return (<h4>You have passed on and cannot face this conflict.</h4>);
        }
    }
}

export default class Conflict extends React.Component {
    finishNarration() {
        makePatchRequest(
            `/api/conflicts/${this.props.conflict.id}/finish_narration`,
            this.props.activeParticipant.guid,
            {}
        );
    }

    render() {
        if (!this.props.conflict.narrated) {
            if (this.props.activeParticipant.role == 'gm') {
                return (
                    <div>
                        <p>Narrate the conflict. What's happening?</p>
                        <button className="btn btn-primary" onClick={this.finishNarration.bind(this)}>Finish Narration</button>
                    </div>
                );
            } else {
                return (<div>
                    <h3>A conflict has begun. The GM is explaining the situation.</h3>
                    <em>Stand by to react.</em>
                </div>);
            }
        } else {
            if (this.props.conflict.active_resolutions.length > 0) {
                return (<Resolution
                    resolution={this.props.conflict.active_resolutions[0]}
                    activeParticipant={this.props.activeParticipant}
                    conflict={this.props.conflict}
                    gameId={this.props.gameId} />);
            } else {
                if (this.props.activeParticipant.role == 'gm') {
                    return (<h3>The players are deciding who will face the challenge.</h3>);
                } else {
                    return (<PlayerConflictOptions activeParticipant={this.props.activeParticipant} conflict={this.props.conflict} />)
                }
            }
        }
    }
};
