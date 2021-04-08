import React from 'react';

import Resolution from './resolution';
import { makePatchRequest, makePostRequest } from 'util/requests';


class PlayerConflictOptions extends React.Component {
    rollForConflict() {
        makePostRequest(
            `/api/conflicts/${this.props.conflictId}/resolutions`,
            this.props.activeParticipant.guid,
            {
                type: 'RollResolution',
            }
        )
    }

    liveMoment() {
        makePostRequest(
            `/api/conflicts/${this.props.conflictId}/resolutions`,
            this.props.activeParticipant.guid,
            {
                type: 'MomentResolution',
            }
        )
    }


    render() {
        if (this.props.activeParticipant.is_alive) {
            if (this.props.activeParticipant.top_trait == 'moment') {
                return (
                    <div>
                        <button onClick={this.rollForConflict.bind(this)}>Roll</button>
                        <button onClick={this.liveMoment.bind(this)}>Live Moment</button>
                    </div>
                )
            } else {
                return (
                    <div>
                        <button onClick={this.rollForConflict.bind(this)}>Roll</button>
                    </div>
                )
            }
        } else {
            return (<em>You have passed on and cannot face this conflict.</em>);
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
                        <button onClick={this.finishNarration.bind(this)}>Finish Narration</button>
                    </div>
                );
            } else {
                return (<em>The GM is narrating the conflict.</em>);
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
                    return (<em>The players are deciding who will face the challenge.</em>);
                } else {
                    return (<PlayerConflictOptions activeParticipant={this.props.activeParticipant} conflictId={this.props.conflict.id} />)
                }
            }
        }
    }
};
