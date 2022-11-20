import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type BaseDialogProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  actionButtonLabel?: string;
  cancelButtonLabel?: string;
  onClose?: () => void;
  onCloseCallback?: (props: any) => void;
  showCancelButton?: boolean;
};

const Dialog: React.FC<BaseDialogProps> = ({
  title,
  body,
  visible,
  actionButtonLabel = 'Close',
  cancelButtonLabel = 'Cancel',
  onClose,
  onCloseCallback,
  showCancelButton = false,
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
        {showCancelButton && <Button onClick={onClose}>{cancelButtonLabel}</Button>}
        <Button onClick={onCloseCallback}>{actionButtonLabel}</Button>
      </Modal.Footer>
    </Modal>
  );
};

type DialogProps = {
  title?: React.ReactNode;
  body?: React.ReactNode;
  infoTrigger?: React.ReactNode;
  actionButtonLabel?: string;
  cancelButtonLabel?: string;
  showCancelButton?: boolean;
  onCloseDialogCallback?: () => void;
};

const useDialog = (props: DialogProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  const onDialogClose = () => {
    if (props.onCloseDialogCallback) {
      props.onCloseDialogCallback();
    }
    closeDialog();
  };

  const closeDialog = () => {
    setModalShow(false);
  };

  const triggerEl = props.infoTrigger || 'Select';

  const DialogComponent = (
    <>
      <div onClick={() => setModalShow(true)}>
        {triggerEl}
      </div>

      <Dialog
        visible={modalShow}
        onClose={closeDialog}
        onCloseCallback={onDialogClose}
        actionButtonLabel={props.actionButtonLabel}
        cancelButtonLabel={props.cancelButtonLabel}
        showCancelButton={props.showCancelButton}
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
