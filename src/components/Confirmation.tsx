import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { useNavigate } from "react-router";
import CustomButton from "./Common/CustomButton";

const Confirmation = ({ isOpen, toggle, submit }: any) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      style={{
        maxWidth: "400px",
        padding: 20,
      }}
    >
      <ModalBody
        style={{
          padding: "30px",
        }}
      >
        <h5
          style={
            {
              // textAlign: "center",
            }
          }
        >
          Are you sure you want to update your availability status?
        </h5>
        <div className=" d-flex justify-content-end gap-2">
          <CustomButton
            name="Cancel"
            color="#E30613"
            bgColor="#fff"
            width="30%"
            className=" mt-3"
            padding="5px"
            onClick={() => toggle()}
          />
          <CustomButton
            name="Yes"
            bgColor="#000"
            width="30%"
            className=" mt-3"
            onClick={() => submit()}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Confirmation;
