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



class TraitCard extends React.Component {
    pretext() {
        switch (this.props.traitType) {
            case 'brink':
                if (this.props.traitGiver.role == 'gm') {
                    return "They've seen you...";
                }

                if (this.props.holderRole == 'gm') {
                    return "I've seen Them...";
                }

                return "I've seen you...";
            case 'virtue':
                return "My virtue:"
            case 'vice':
                return 'My vice:';
            case 'moment':
                return 'I will find hope...';
        }
    }

    pretextColorClass() {
        return this.props.burned ? 'text-white' : 'text-muted';
    }

    mainTextColorClass() {
        return this.props.burned ? 'text-white' : 'text-body';
    }

    render() {
        return (
            <li key={this.props.traitType} className={`list-group-item ${this.props.burned ? "bg-secondary" : "bg-light" }`}>
                <h6 className={`float-right ${this.mainTextColorClass()}`}>{this.props.traitType}</h6>
                <div className={this.pretextColorClass()}><em>{this.pretext()}</em></div>
                <span className={this.mainTextColorClass()}>{this.props.traitValue}</span>
            </li>
        );
    }
}

function brinkValueToDisplay(props) {
    if (props.controlledByUser || props.brink_embraced) {
        return props.brink;
    }

    return "(hidden)"
}

function traitCardForTraitId(id, props) {
    let traitType;
    let traitValue;
    let traitGiver;

    switch (id) {
        case "0":
            traitType = "virtue";
            traitValue = props.virtue;
            traitGiver = props.right_player;
            break;
        case "1":
            traitType = "vice";
            traitValue = props.vice;
            traitGiver = props.left_player;
            break;
        case "2":
            traitType = "moment";
            traitValue = props.moment;
            traitGiver = null;
            break;
        case "3":
            traitType = "brink";
            traitValue = brinkValueToDisplay(props);
            traitGiver = props.right_participant;
            break;
    }

    return (
        <TraitCard
            key={id}
            burned={props.burned_traits.includes(id)}
            holderRole={props.role}
            traitType={traitType}
            traitValue={traitValue}
            traitGiver={traitGiver}
        />);
}

function cardsToRender(props) {
    if (!props.game || ['nascent', 'traits'].includes(props.game.setup_state)) {
        return [];
    }
    if (props.controlledByUser) {
        if (props.role == 'player') {
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
        } else if (['order_cards', 'ready'].includes(props.game.setup_state)) {
            return ['3'];
        }
    } else {
        if (props.game.setup_state == 'ready' && props.role == 'player') {
            return [props.top_trait_id]
        }

        return [];
    }
}

function TraitCardList(props) {
    if (!props.game || ['nascent', 'traits'].includes(props.game.setup_state)) {
        return (null);
    }

    return (
        <ul className={"list-group list-group-flush d-block " + cardColorClass(props)}>
            {cardsToRender(props).map(cardId => traitCardForTraitId(cardId, props))}
        </ul>
    );
}

function HopeDieIndicator(props) {
    console.log(props)
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
