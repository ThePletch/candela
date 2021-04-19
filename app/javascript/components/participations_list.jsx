import React from 'react';

import Participation from './participation';


export default function (props) {
    if (props.participations) {
        return (
            <div className="card-group">
              {props.participations.sort(p => p.position).map(participant => <Participation key={participant.id} game={props.game} {...participant} controlledByUser={participant.id == props.activeParticipant} />)}
            </div>
        );
    } else {
        return (<em>Loading...</em>);
    }
};
