import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import Icons
import FeatherIcon from "feather-icons-react";

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

//i18n
import { withTranslation } from "react-i18next";
import NotificationBar from "src/components/Notification/NotificationBar";
import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { useNotification } from "src/context/NotificationContext";

const GET_ALL_NOTIFICATIONS = gql`
  query AllNotification($input: getAllNotificationInput) {
    getAllNotification(input: $input) {
      allNotification {
        _id
        message
        permissions
        orderId
        title
        productId
        type
        view {
          id
          remove
        }
        createdAt
        updatedAt
      }
      unReadCount
    }
  }
`;

const READ_NOTIFICATION = gql`
  mutation AddNotificationViewPersonId($input: addNotificationViewPersonIdInput!) {
    addNotificationViewPersonId(input: $input) {
      status
      msg
    }
  }
`;

const NotificationDropdown = (props: any) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [openBar, setOpenBar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { unreadCount, setUnreadCount } = useNotification();

  const {
    data: notificationsData,
    loading: notificationsLoading,
    error,
    refetch,
  } = useQuery(GET_ALL_NOTIFICATIONS, {
    variables: {
      input: {
        filter: "",
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (notificationsData && notificationsData?.getAllNotification?.allNotification) {
      setNotifications(notificationsData?.getAllNotification?.allNotification);
      setUnreadCount(notificationsData?.getAllNotification?.unReadCount);
    }
  }, [notificationsData]);

  const [ReadNotification] = useMutation(READ_NOTIFICATION);
  const handleReadNotification = async (ID: any) => {
    try {
      const response = await ReadNotification({
        variables: {
          input: {
            notificationId: ID,
          },
        },
      });
      console.log("READ RESPONSE = ", response);
      if (response && response?.data?.addNotificationViewPersonId?.status) {
        console.log(response?.data?.addNotificationViewPersonId?.msg);
      } else {
        console.log("not read");
      }
      refetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
    }
  };

  useEffect(() => {
    refetch();
  }, [menu]);

  console.log("NOTIFICATIONS = ", notifications);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
          onClick={() => setMenu(true)}
        >
          <FeatherIcon
            icon="bell"
            className="icon-lg"
          />
          <span className="badge bg-danger rounded-pill">{unreadCount}</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div
                className="col-auto"
                onClick={() => {
                  setOpenBar(true);
                  setMenu(false);
                }}
              >
                <p
                  className="small text-danger"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  View All
                </p>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "250px" }}>
            {notifications && notifications?.length ? (
              notifications?.map((item: any, index) => (
                <Link
                  to={
                    item?.type === "new_order"
                      ? `/orders/details?orderId=${item?.orderId}`
                      : item?.type === "low_stock" || item?.type === "out_of_stock"
                      ? `/product/details/?_id=${item?.productId}`
                      : item?.type === "return_order"
                      ? `/return-orders/details?orderId=${item?.orderId}&_id=${item?.productId}`
                      : "/"
                  }
                  key={index}
                  className="text-reset notification-item"
                  onClick={() => {
                    handleReadNotification(item?._id);
                    setMenu(false);
                  }}
                >
                  <div className="d-flex">
                    {/* <div className="avatar-sm me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-cart" />
                      </span>
                    </div> */}
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">{item?.title}</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{item?.message}</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline" /> {moment(item?.createdAt).fromNow()}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <i className="text-muted font-size-12 ms-3">No notifications yet. Stay tuned for updates!</i>
            )}

            {/* <Link
              to=""
              className="text-reset notification-item"
            >
              <div className="d-flex">
                <img
                  src={avatar3}
                  className="me-3 rounded-circle avatar-sm"
                  alt="user-pic"
                />
                <div className="flex-grow-1">
                  <h6 className="mt-0 mb-1">James Lemire</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">{props.t("It will seem like simplified English") + "."}</p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline" />
                      {props.t("1 hours ago")}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to=""
              className="text-reset notification-item"
            >
              <div className="d-flex">
                <div className="avatar-sm me-3">
                  <span className="avatar-title bg-success rounded-circle font-size-16">
                    <i className="bx bx-badge-check" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mt-0 mb-1">{props.t("Your item is shipped")}</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">{props.t("If several languages coalesce the grammar")}</p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline" /> {props.t("3 min ago")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to=""
              className="text-reset notification-item"
            >
              <div className="d-flex">
                <img
                  src={avatar4}
                  className="me-3 rounded-circle avatar-sm"
                  alt="user-pic"
                />
                <div className="flex-grow-1">
                  <h6 className="mt-0 mb-1">Salena Layfield</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">{props.t("As a skeptical Cambridge friend of mine occidental") + "."}</p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline" />
                      {props.t("1 hours ago")}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </Link> */}
          </SimpleBar>
          {/* <div className="p-2 border-top d-grid">
            <p
              className="btn btn-sm btn-link font-size-14 btn-block text-center text-decoration-none"
              onClick={() => {
                setOpenBar(true);
                setMenu(false);
              }}
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i> {props.t("View all")}{" "}
            </p>
          </div> */}
        </DropdownMenu>
      </Dropdown>
      <NotificationBar
        isOpen={openBar}
        setOpen={setOpenBar}
      />
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};
