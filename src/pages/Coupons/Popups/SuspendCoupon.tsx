import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { useNavigate } from "react-router";
import CustomButton from "src/components/Common/CustomButton";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

const SUSPEND_COUPON = gql`
  mutation AdminSuspendTheCupone($input: adminSuspendTheCuponeInput!) {
    adminSuspendTheCupone(input: $input) {
      status
      msg
    }
  }
`;

const SuspendCoupon = ({ isOpen, toggle, isActive, setCouponID, couponID, refetch }: any) => {
  const [suspendCoupon] = useMutation(SUSPEND_COUPON);

  const submit = async () => {
    try {
      const response = await suspendCoupon({
        variables: {
          input: {
            isActive,
            _id: couponID,
          },
        },
      });
      if (response?.data?.adminSuspendTheCupone?.status) {
        toast.success(response?.data?.adminSuspendTheCupone?.msg);
        refetch();
        setCouponID("");
        toggle();
      }
      console.log("RESPONSE = ", response);
    } catch (error: any) {
      console.log("SUSPEND ERROR = ", error);
    }
  };

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
        <h5>Are you sure you want to {isActive ? "active" : "suspend"} this coupon?</h5>
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

export default SuspendCoupon;
