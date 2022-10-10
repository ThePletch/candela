import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function PopupForm(props: {
  label: string;
  formComplete: boolean;
  children: any;
}) {
  // Show the form on load if it isn't complete yet.
  const [show, setShow] = useState(!props.formComplete);

  return (
    <>
      <div style={{ display: 'grid' }}>
        <Button
          variant={props.formComplete ? 'secondary' : 'primary'}
          onClick={() => setShow(true)}
        >
          {props.label}
        </Button>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>{props.children}</Modal.Body>
      </Modal>
    </>
  );
}
