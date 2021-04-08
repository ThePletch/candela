import React from 'react';

import Truth from './truth';

function AreWeAlive(props) {
    if (props.truthsAllStated) {
        return (<span>...and we are alive.</span>);
    } else {
        return (null);
    }
}

export default function (props) {
    // we don't want to display this for the first scene.
    if (props.truths.length > 0 || props.truthsRemaining > 0) {
        return (
            <div>
                <em>These things are true...</em>
                <ul>
                    <li key="0">The world is dark.</li>
                    {props.truths.map(truth => <li key={truth.id}><Truth {...truth}/></li>)}
                </ul>
                <AreWeAlive truthsAllStated={props.truthsRemaining === 0} />
            </div>
        );
    } else {
        return (null);
    }
};
