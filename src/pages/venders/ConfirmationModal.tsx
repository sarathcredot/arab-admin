import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>Confirm Action</ModalHeader>
      <ModalBody>
        Are you sure you want to verify this vendor?
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onConfirm}>
          Confirm
        </Button>{" "}
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
