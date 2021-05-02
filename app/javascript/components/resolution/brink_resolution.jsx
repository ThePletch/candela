import React from 'react';

import OverrideResolution from './override_resolution';

export default class BrinkResolution extends OverrideResolution {
	playerRollResult() {
		return (<div>
			{this.parentResolution().playerRollResult()}
			<em>But {this.props.resolution.active_player} chose to embrace their brink.</em>
			{super.playerRollResult()}
		</div>);
	}

	hopeDieLossMessage() {
		if (this.props.resolution.hope_die_count == 1) {
			return (<span>Their hope die has been lost.</span>);
		}

		if (this.props.resolution.hope_die_count > 1) {
			return (<span>All of their hope dice have been lost.</span>);
		}

		return (null);
	}

	additionalInfo() {
		if (!this.props.resolution.successful) {
			return (<div>
				<span>{this.props.resolution.active_player} has been consumed by their brink.</span>
				{this.hopeDieLossMessage()}
				<span>Their brink has been burned and can no longer be embraced.</span>
			</div>);
		} else {
			return super.additionalInfo();
		}
	}
}
