import React from 'react';

import BaseResolution from './base';
import { get_resolution_class } from './resolution';

export default class OverrideResolution extends BaseResolution {
  parentResolution() {
    const parentProps = {
      ...this.props,
      resolution: this.props.resolution.parent_resolution
    }
    return get_resolution_class(parentProps);
  }
}
