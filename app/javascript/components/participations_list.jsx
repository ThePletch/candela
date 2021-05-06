import React from 'react';

import Participation from './participation';

function renderSingleParticipant(participant, game, activeParticipant, activePosition, participantCount) {
    const activePositionDelta = participant.position - activePosition;
    const stackIndex = participantCount - Math.abs(activePositionDelta);
    return (
        <Participation
            key={participant.id}
            game={game}
            controlledByUser={participant.id == activeParticipant}
            positionDelta={activePositionDelta}
            stackIndex={stackIndex}
            {...participant}
        />
    );
}

export default class ParticipationsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    toggleVisibility() {
        this.setState({visible: !this.state.visible})
    }

    render() {
        if (this.props.participations) {
            const activeParticipantObj = this.props.participations.find(p => p.id == this.props.activeParticipant)

            let activeParticipantPosition;
            if (activeParticipantObj) {
                activeParticipantPosition = activeParticipantObj.position;
            } else {
                activeParticipantPosition = -1;
            }

            return (
                <div className="participations-list-wrapper">
                    <button type="button" onClick={this.toggleVisibility.bind(this)} className="participations-button">
                        Players
                    </button>
                    <div className={`collapse ${this.state.visible && 'show'}`} id="farticipations-list">
                        <div className="participations-list">
                          {this.props.participations.map(participant => renderSingleParticipant(participant, this.props.game, this.props.activeParticipant, activeParticipantPosition, this.props.participations.length))}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<em>Loading...</em>);
        }
    }
};
