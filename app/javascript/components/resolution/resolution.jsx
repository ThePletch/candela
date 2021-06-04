import React from 'react';

import BrinkResolution from './brink_resolution';
import MartyrResolution from './martyr_resolution';
import MomentResolution from './moment_resolution';
import RollResolution from './roll_resolution';
import TraitResolution from './trait_resolution';

export function get_resolution_class(props) {
  switch (props.resolution.type) {
    case 'RollResolution':
      return new RollResolution(props);
    case 'MomentResolution':
      return new MomentResolution(props);
    case 'MartyrResolution':
      return new MartyrResolution(props);
    case 'BrinkResolution':
      return new BrinkResolution(props);
    case 'TraitResolution':
      return new TraitResolution(props);
    default:
      throw `No such resolution type ${props.resolution.type}!`
  }
}

export class Resolution extends React.Component {
  render() {
    return get_resolution_class(this.props).render();
  }
}
