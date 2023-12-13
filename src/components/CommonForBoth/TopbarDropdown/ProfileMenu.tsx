import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { Link, Navigate, useNavigate } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

//redux
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { gql, useQuery } from "@apollo/client";
import { addInvoice } from "src/helpers/fakebackend_helper";


interface profilePic{
  fileURL:string
 }
interface AdminData{
  email:string;
  fullName:string;
  profilePic:profilePic
}

const ProfileMenu = (props: any) => {
  // const { success } = useSelector((state: any) => ({
  //   success: state.profile.success,
  // }));

  const profiledata = createSelector(

    (state : any) => state.profile,
    (state) => ({
      success: state.success,
    })
  );
// Inside your component
const { success} = useSelector(profiledata);

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState<boolean>(false);
  const [data,setData] = useState<AdminData>()

  const [username, setusername] = useState("Admin");
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    const getAuthUser = localStorage.getItem("authUser");
    if (getAuthUser) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(getAuthUser);
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(getAuthUser);
        setusername(obj.username);
      }
    }
  }, [success]);

  const toggleLogoutModal = () => setLogoutModal(!logoutModal);
  const handleLogout= async () => {

    localStorage.removeItem("admin_token")
    navigate("/login")
  
  }

  const GET_ADMIN=gql`
  query Record {
    getAdminRecord {
      record {
        email
        fullName
        profilePic {
          fileURL
        }
      }
    }
  }
  `

const {
  loading: adminLoading,
  error: adminError,
  data: adminData,
  refetch: adminRefetch,
} = useQuery(GET_ADMIN);
const token = localStorage.getItem("admin_token");
const adminImage = localStorage.getItem("adminData");
useEffect(() => {
  if (adminData && adminData.getAdminRecord && adminData.getAdminRecord.record) {
    setData(adminData.getAdminRecord.record);
  }
}, [token, adminImage,adminData]);



  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          {data?.profilePic?
          (
            <img
            className="rounded-circle header-profile-user"
            src={data?.profilePic?.fileURL}
            alt="Header Avatar"
          />
          ):   <img
          className="rounded-circle header-profile-user"
          src={user1}
          alt="Header Avatar"
        />
        }
         
          <span className="d-none d-xl-inline-block ms-1 fw-medium">{data?.fullName}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">

          <Link to={"/profile"} className="dropdown-item">
            <i className="bx bx-user font-size-16 align-middle me-1" />{" "}
            {props.t("Profile")}{" "}
          </Link>{" "}

          {/* <Link to={"/contacts-profile"} className="dropdown-item">
            <i className="bx bx-wrench font-size-16 align-middle me-1" />
            {props.t("Settings")}
          </Link>

          <Link to="/page-lock-screen" className="dropdown-item">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t("Lock screen")}
          </Link> */}

          <div className="dropdown-divider" />
          <Link to="" className="dropdown-item" onClick={toggleLogoutModal}>
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
          
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={logoutModal} toggle={toggleLogoutModal}>
        <ModalHeader toggle={toggleLogoutModal}>Logout Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to logout?
        </ModalBody>
        <ModalFooter>
          <Button style={{backgroundColor:"rgba(0, 0, 0, 1)"}} onClick={toggleLogoutModal}>
            Cancel
          </Button>
          <Button  style={{backgroundColor:"rgba(177, 35, 73, 1)"}}  onClick={handleLogout}>
            Logout
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};



export default withTranslation()(ProfileMenu);
