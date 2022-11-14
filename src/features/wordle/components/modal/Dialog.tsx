import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type BaseDialogProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  actionButtonLabel?: string;
  onClose?: () => void;
};

const Dialog: React.FC<BaseDialogProps> = ({
  title,
  body,
  visible,
  actionButtonLabel = 'Close',
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
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>{actionButtonLabel}</Button>
      </Modal.Footer>
    </Modal>
  );
};

type DialogProps = {
  title?: React.ReactNode;
  body?: React.ReactNode;
  infoTrigger?: React.ReactNode;
  actionButtonLabel?: string;
  onCloseDialogCallback?: () => void;
};

const useDialog = (props: DialogProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  const onDialogClose = () => {
    if (props.onCloseDialogCallback) {
      props.onCloseDialogCallback();
    }
    setModalShow(false);
  };

  const triggerEl = props.infoTrigger || 'Select';

  const DialogComponent = (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        {triggerEl}
      </Button>

      <Dialog
        visible={modalShow}
        onClose={onDialogClose}
        actionButtonLabel={props.actionButtonLabel}
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
