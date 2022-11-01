import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type BaseDialogProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  onClose?: () => void;
};

const Dialog: React.FC<BaseDialogProps> = ({
  title,
  body,
  visible,
  onClose,
}: BaseDialogProps) => {
  return (
    <Modal
      show={visible}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

type DialogProps = {
  title?: React.ReactNode;
  body?: React.ReactNode;
  infoTrigger?: React.ReactNode;
};

const useDialog = (props: DialogProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  const DialogComponent = (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>

      <Dialog
        visible={modalShow}
        onClose={() => setModalShow(false)}
        title={props.title}
        body={props.body}
        />
    </>
  );

  return {
    DialogComponent,
    dialogVisible: modalShow,
    setDialogVisible: setModalShow,
  };
};

export { Dialog as default, useDialog };
