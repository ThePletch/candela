import { type ReactElement, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function PopupForm({
  label,
  formComplete,
  children,
}: {
  label: string;
  formComplete: boolean;
  children: ReactElement | ReactElement[];
}) {
  // Show the form on load if it isn't complete yet.
  const [show, setShow] = useState(!formComplete);

  return (
    <>
      <div className="float-right">
        <Button
          variant={formComplete ? 'secondary' : 'primary'}
          onClick={() => setShow(true)}
        >
          {label}
        </Button>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </>
  );
}
