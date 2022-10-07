import type { ReactElement, ReactNode } from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function SetupForm(
  actions: ReactNode,
  status: ReactNode
): ReactElement {
  return (
    <div className="game-setup">
      <Row>
        <Col>
          <h3>Actions</h3>
          {actions}
        </Col>
        <Col>
          <h3>Status</h3>
          {status}
        </Col>
      </Row>
    </div>
  );
}
