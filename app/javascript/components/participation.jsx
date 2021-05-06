import React from 'react'
import classNames from 'classnames'

function Bio(props) {
    if (props.role == 'player') {
        return (
            <p className="character-concept">{props.character_concept}</p>
        );
    } else {
        return (null);
    }
}

function AliveFooter(props) {

    if (props.role == 'player') {
        return (
            <div className={`alive-footer card-footer ${props.is_alive ? 'bg-success' : 'bg-secondary'}`}>
                <small>{props.is_alive ? "Fighting for survival." : "Passed on."}</small>
            </div>
        );
    } else {
        return (null);
    }
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

    render() {
        const classes = classNames({
            'trait-card': true,
            burned: this.props.burned,
            'active-trait': this.props.isTopTrait,
            'inactive-trait': !this.props.isTopTrait,
        });

        return (
            <li key={this.props.traitType} className={classes}>
                <h6 className="trait-type">{this.props.traitType}</h6>
                <div className="trait-pretext"><em>{this.pretext()}</em></div>
                <span className="trait-value">{this.props.traitValue}</span>
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
            isTopTrait={id == props.top_trait_id}
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
        }

        if (['order_cards', 'ready'].includes(props.game.setup_state)) {
            return ['3'];
        }

        return [];
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
        <ul className="trait-list">
            {cardsToRender(props).map(cardId => traitCardForTraitId(cardId, props))}
        </ul>
    );
}

function HopeDieIndicator(props) {
    if (props.role == 'player' && props.hope_die_count > 0) {
        return (<div className="hope-dice-indicator">
            <span class="hope-dice-pretext">Found hope.</span>
            {_.times(props.hope_die_count, n => { return(<span key={`hope-${props.id}-${n}`} className="hope-die-badge">&nbsp;</span>) })}
        </div>);
    }

    return (null);
}

export default class Participation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    toggleExpanded() {
        this.setState({collapsed: !this.state.collapsed})
    }

    render() {
        const participationClasses = classNames({
            participation: true,
            active: this.props.controlledByUser,
            inactive: !this.props.controlledByUser,
            collapsed: this.state.collapsed,
            [this.props.role]: true,
        });

        return (
            <div className={participationClasses}>
                <div className="participation-info" onClick={this.toggleExpanded.bind(this)}>
                    <div className="participation-main-block">
                        <h4 className="participation-name">{this.props.name}</h4>
                        <h6 className="participation-type">
                            <div className="participation-role">{this.props.role}</div>
                            {
                                this.props.controlledByUser &&
                                <div><small className="is-character">Your character</small></div>
                            }
                        </h6>
                    </div>
                    <Bio {...this.props} />
                    <TraitCardList {...this.props} />
                    <HopeDieIndicator {...this.props} />
                    <div className="expand-prompt">Click to expand</div>
                </div>
                <AliveFooter {...this.props} />
            </div>
        );
    }

}
