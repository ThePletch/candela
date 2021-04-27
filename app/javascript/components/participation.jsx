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
    }

    if (props.controlledByUser) {
        return 'bg-white';
    }

    return 'bg-light';
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

function brinkValueToDisplay(props) {
    if (props.controlledByUser || props.burned_traits.includes("3")) {
        return props.brink;
    }

    return "(hidden)"
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
            traitValue = brinkValueToDisplay(props);
            break;
    }

    return (<TraitCard key={id} burned={props.burned_traits.includes(id)} traitType={traitType} traitValue={traitValue}/>);
}

function cardsToRender(props) {
    if (!props.game || ['nascent', 'traits'].includes(props.game.setup_state)) {
        return [];
    }
    if (props.controlledByUser) {
        if (['module_intro', 'character_concept', 'moments'].includes(props.game.setup_state)) {
            return ['0', '1'];
        }

        if (props.game.setup_state == 'brinks') {
            return ['0', '1', '2'];
        }

        if (props.game.setup_state == 'order_cards') {
            if (props.card_order) {
                return props.card_order.split("").concat(["3"]);
            }

            return ['0', '1', '2', '3'];
        }

        if (props.game.setup_state == 'ready') {
            return props.card_order.split("").concat(["3"]);
        }
    } else {
        if (props.game.setup_state == 'ready') {
            return [props.top_trait_id]
        }

        return [];
    }
}

function TraitCardList(props) {
    if (!props.game || ['nascent', 'traits'].includes(props.game.setup_state)) {
        return (null);
    }

    if (props.role == 'player') {
        return (
            <ul className={"list-group list-group-flush d-block " + cardColorClass(props)}>
                {cardsToRender(props).map(cardId => traitCardForTraitId(cardId, props))}
            </ul>
        );
    } else {
        return (null);
    }
}

function HopeDieIndicator(props) {
    if (props.role == 'player' && props.hope_die_count > 0) {
        return (<div>
            Hope dice:&nbsp;
            {_.times(props.hope_die_count, n => { return(<span className="badge badge-pill badge-primary">&nbsp;</span>) })}
        </div>);
    }

    return (null);
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
                <HopeDieIndicator {...props} />
            </div>
            <AliveFooter {...props} />
        </div>
    )

}
