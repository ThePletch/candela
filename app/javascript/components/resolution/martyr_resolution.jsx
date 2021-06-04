import React from 'react';

import OverrideResolution from './override_resolution';

export default class MartyrResolution extends OverrideResolution {
  activePlayerInfo() {
        return this.parentResolution().activePlayerInfo();
    }

    narrativeControlInfo() {
      let originalPlayer = this.props.resolution.parent_resolution.active_player;
        return (<span>
          {this.props.resolution.narrative_control} sacrificed themselves to save {originalPlayer}.
          They have narrative control.
        </span>);
    }

    successMessage() {
        return (<span>{this.props.resolution.parent_resolution.active_player} failed, but has been saved.</span>);
    }
}
