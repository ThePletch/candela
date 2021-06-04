import React from 'react';

import OverrideResolution from './override_resolution';

export default class TraitResolution extends OverrideResolution {

  playerRollResult() {
    return (<div>
      {this.parentResolution().playerRollResult()}
      <em>But {this.props.resolution.active_player} burned their {this.props.resolution.burned_trait_name} to reroll ones.</em>
      {super.playerRollResult()}
    </div>);
  }
}
