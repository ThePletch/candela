import React from 'react'
import PropTypes from 'prop-types'

import SetupForm from './setup_form'


export default class ModuleIntroPrompt extends SetupForm {
    static propTypes = {
        gameId: PropTypes.number.isRequired,
        activeParticipant: PropTypes.object,
    }

    advanceStage () {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify({current_setup_state: 'module_intro'})
        };

        fetch(`/api/games/${this.props.gameId}/advance_setup_state`, requestOptions);
    }

    actions() {
        if (this.props.activeParticipant.role == 'gm') {
          return (<div>
            <em>Introduce the scenario for the game to your players.</em>
            <button className="btn btn-primary d-block" onClick={this.advanceStage.bind(this)}>Done introducing scenario</button>
          </div>);
        }
    }

    status() {
        if (this.props.activeParticipant.role == 'player') {
          return <em>GM is introducing the scenario...</em>;
        }
    }
};
