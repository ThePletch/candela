import React from 'react';

import BaseResolution from './base';

export default class MomentResolution extends BaseResolution {
	additionalInfo() {
		if (this.props.resolution.successful) {
			return (<span>{this.props.resolution.active_player} lived their moment and has earned a hope die.</span>);
		} else {
			return super.additionalInfo();
		}
	}
}
