import React from 'react'

function Bio(props) {
    if (props.role == 'player') {
        return (
            <p className="card-text">{props.character_concept}</p>
        );
    } else {
        return (null);
    }
}

function AliveFooter(props) {

    if (props.role == 'player') {
        return (
            <div className={`card-footer ${props.is_alive ? 'bg-success' : 'bg-secondary'}`}>
                <small>{props.is_alive ? "Fighting for survival." : "Passed on."}</small>
            </div>
        );
    } else {
        return (null);
    }
}

function cardColorClass(props) {
    if (props.role == 'gm') {
        return 'bg-info';
    } else {
        return 'bg-light';
    }
}

// todo make this account for who gave you the trait
function traitCardPretext(type) {
    switch (type) {
        case 'brink':
            return "I've seen you...";
        case 'virtue':
        case 'vice':
            return '';
        case 'moment':
            return 'I will find hope...';
    }
}

function TraitCard(props) {
    return (
        <li key={props.traitType} className={`list-group-item ${props.burned ? "bg-secondary" : "bg-light" }`}>
            <h6 className="float-right">{props.traitType}</h6>
            <div className="text-muted"><em>{traitCardPretext(props.traitType)}</em></div>
            <span>{props.traitValue}</span>
        </li>
    );
}

function traitCardForTraitId(id, props) {
    let traitType;
    let traitValue;

    switch (id) {
        case "0":
            traitType = "virtue";
            traitValue = props.virtue;
            break;
        case "1":
            traitType = "vice";
            traitValue = props.vice;
            break;
        case "2":
            traitType = "moment";
            traitValue = props.moment;
            break;
        case "3":
            traitType = "brink";
            traitValue = props.brink;
            break;
    }

    return (<TraitCard key={id} burned={props.burned_traits.includes(id)} traitType={traitType} traitValue={traitValue}/>);
}

function TraitCardList(props) {
    var preTraitsStates = ['nascent', 'traits'];
    if (!props.game) {
        return (null);
    }
    if (preTraitsStates.includes(props.game.setup_state)) {
        return (null);
    }

    if (props.controlledByUser) {
        console.log(props);
        return (
            <ul className="list-group list-group-flush">
                {(props.card_order + "3").split("").map(cardId => traitCardForTraitId(cardId, props))}
            </ul>
        );
    } else if (props.role == 'player') {
        return (
            <ul className="list-group list-group-flush">
                <TraitCard traitType={props.top_trait} traitValue={props.top_trait_value} />
            </ul>
        );
    } else {
        return (null);
    }
}

export default function Participation(props) {
	return (
        <div className={`card ${cardColorClass(props)}`} style={{width: '18rem'}}>
            <div className="card-body">
                <h6 className="float-right">
                    <div className="text-right"><small>{props.role}</small></div>
                    {
                        props.controlledByUser &&
                        <div><small className="text-muted">Your character</small></div>
                    }
                </h6>
                <h4 className="card-title">{props.name}</h4>
                <Bio {...props} />
                <TraitCardList {...props} />
            </div>
            <AliveFooter {...props} />
        </div>
    )

}
