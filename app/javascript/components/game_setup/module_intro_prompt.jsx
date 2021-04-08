import React from 'react'
import PropTypes from 'prop-types'


export default class ModuleIntroPrompt extends React.Component {
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

    render() {
        if (this.props.activeParticipant.role == 'gm') {
          return <button onClick={this.advanceStage.bind(this)}>Done introducing scenario</button>
        } else {
          return <em>GM is introducing the scenario...</em>;
        }
    }
};
