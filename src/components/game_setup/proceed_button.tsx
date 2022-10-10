import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import type { HttpState } from '@candela/util/state';

export default function ProceedButton<T>({
  label,
  httpRequest,
  disabled,
  disabledTooltip,
}: {
  label: string;
  httpRequest: HttpState<T>;
  disabled: boolean;
  disabledTooltip: string;
}) {
  const button = (
    <div style={{ display: 'grid' }}>
      <Button
        variant="primary"
        onClick={() => httpRequest.makeRequest()}
        disabled={httpRequest.loading || disabled}
        // Need to set pointerEvents to none so we can still trigger
        // tooltips from a disabled button
        style={disabled ? { pointerEvents: 'none' } : undefined}
        size="lg"
      >
        {label}
      </Button>
    </div>
  );

  if (disabled) {
    const tooltip = (
      <Tooltip id="proceed-button-tooltip">{disabledTooltip}</Tooltip>
    );
    return (
      <OverlayTrigger overlay={tooltip} placement="auto">
        {button}
      </OverlayTrigger>
    );
  }

  return button;
}
