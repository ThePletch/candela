import type { ReactElement, ReactNode } from "react";

export default function SetupForm(
  actions: ReactNode,
  status: ReactNode
): ReactElement {
  return (
    <div className="game-setup">
      <div className="row">
        <div className="col">
          <h3>Actions</h3>
          {actions}
        </div>
        <div className="col">
          <h3>Status</h3>
          {status}
        </div>
      </div>
    </div>
  );
}
