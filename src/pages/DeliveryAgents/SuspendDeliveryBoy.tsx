import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  agentId: string | undefined;
  isActive: boolean | undefined;
  refetch: () => void;
}

const CHANGE_STATUS = gql`
  mutation Mutation($input: SuspendDeliveryAgentInput!) {
    suspendDeliveryAgent(input: $input) {
      _id
      message
    }
  }
`;

const SuspendDeliveryBoy: React.FC<Props> = ({ isOpen, toggle, agentId, isActive, refetch }) => {
  const [changeStatus] = useMutation(CHANGE_STATUS);
  const handleSubmit = async () => {
    try {
      const response = await changeStatus({
        variables: {
          input: {
            agentId,
            isActive: !isActive,
          },
        },
      });
      if (response) {
        console.log("RESPONSE = ", response);

        refetch();

        toast.success(response.data.suspendDeliveryAgent.message);
        toggle();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        style={{
          maxWidth:"450px"
        }}
        >
        {/* <ModalHeader toggle={toggle}>Change Status</ModalHeader> */}
        <ModalBody
        style={{
          padding:"30px"

        }}>
          {isActive ? (
            <h5>
              Are you sure you want to <b>Suspend</b> this Delivery Boy ? Please confirm your action.
            </h5>
          ) : (
            <h5>
              Are you sure you want to <b>activate</b> this delivery boy? Please confirm your action.
            </h5>
          )}

          {/* <ModalFooter> */}
            <Button style={{display:"block",marginLeft:"auto"}} color={isActive?"primary":"success"} onClick={() => handleSubmit()}>{isActive ? "Suspend" : "Active"}</Button>
          {/* </ModalFooter> */}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SuspendDeliveryBoy;
