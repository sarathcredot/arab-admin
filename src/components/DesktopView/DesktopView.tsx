import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import close from "./close.svg";
import logo from "../../assets/images/arabDealLogo.svg";
import styles from "./desktopView.module.css";
import { Link } from "react-router-dom";

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const DesktopView: React.FC<Props> = ({ isOpen, toggle }) => {
  const handleClick = () => {
    localStorage.setItem("desktopView", "true");
    toggle();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        style={{
          minWidth: "100%",

          padding: 0,
          margin: 0,
        }}
      >
        <ModalBody
          style={{
            height: "100vh",
            margin: "0 !import",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div className={styles.container}>
            <div className={styles.close}>
              <img
                src={close}
                alt="Close"
                onClick={toggle}
              />
            </div>
            <div className={styles.content}>
              <div
                style={{
                  width: "70%",
                  marginBottom: "35px",
                }}
              >
                <img
                  src={logo}
                  alt="Arab Deals Logo"
                  width={"100%"}
                />
              </div>
              <p style={{ textAlign: "center" }}>
                For a better experience, please open the dashboard on a laptop or use the desktop view.
              </p>
              <div>
                <Button onClick={() => handleClick()}>Switch to Desktop View</Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default DesktopView;
