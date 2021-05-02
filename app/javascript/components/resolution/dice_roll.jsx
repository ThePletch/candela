import React from 'react';


function getHopeDieColor(valueRolled) {
    switch (valueRolled) {
        case "5", "6":
            return 'badge-info';
        case "1":
            return 'badge-warning';
        default:
            return 'badge-primary';
    }
}

function getRegularDieColor(valueRolled) {
    switch (valueRolled) {
        case "6":
            return 'badge-success';
        case "1":
            return 'badge-danger';
        default:
            return 'badge-secondary';
    }
}

function Die(props) {
    let color;
    if (props.hopeDie) {
        color = getHopeDieColor(props.roll);
    } else {
        color = getRegularDieColor(props.roll);
    }

    return (<span className={`badge ${color}`}>{props.roll}</span>);
}


export default function DiceRoll(props) {
    return (
        <div>
            {
                props.roll.split("").map((roll, i) => <Die key={`${props.roller}-` + i} hopeDie={i < props.hope_die_count} roll={roll} />)
            }
        </div>
    );
}
