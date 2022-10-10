import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import type { HttpState } from '@candela/util/state';

export default function ProceedButton(props: {
  label: string;
  httpRequest: HttpState<any>;
  disabled: boolean;
  disabledTooltip: string;
}) {
  const button = (
    <div style={{ display: 'grid' }}>
      <Button
        variant="primary"
        onClick={() => props.httpRequest.makeRequest()}
        disabled={props.httpRequest.loading || props.disabled}
        // Need to set pointerEvents to none so we can still trigger
        // tooltips from a disabled button
        style={props.disabled ? { pointerEvents: 'none' } : undefined}
        size="lg"
      >
        {props.label}
      </Button>
    </div>
  );

  if (props.disabled) {
    const tooltip = (
      <Tooltip id="proceed-button-tooltip">{props.disabledTooltip}</Tooltip>
    );
    return (
      <OverlayTrigger overlay={tooltip} placement="auto">
        {button}
      </OverlayTrigger>
    );
  }

  return button;
}
