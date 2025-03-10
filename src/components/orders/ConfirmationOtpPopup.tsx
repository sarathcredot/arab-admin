import React, { Dispatch, SetStateAction } from "react";
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

type Props = {
  isOpen: boolean;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  toggle: () => void;
  submit: () => Promise<void>|void|null;
};

const ConfirmationOtpPopup = ({ isOpen, toggle, otp, setOtp,submit }: Props) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>OTP Confirmation</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="otp">Please confirm by entering the OTP below.</Label>
            <Input
              type="number"
              name="otp"
              id="otp"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={submit || (() => {})}
          >
            Submit
          </Button>{" "}
          <Button
            color="secondary"
            onClick={toggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ConfirmationOtpPopup;
