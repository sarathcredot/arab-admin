import { gql, useMutation, useQuery } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import FeatherIcon from "feather-icons-react";
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
const REMOVE_NOTIFICATION = gql`
  mutation AddRemoveMarkNotification($input: addNotificationViewPersonIdInput!) {
    addRemoveMarkNotification(input: $input) {
      status
      msg
    }
  }
`;

const NotificationBar = ({ isOpen, setOpen }: any) => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("");
  const [notifications, setNotifications] = useState([]);
  const { unreadCount, setUnreadCount, updateCount } = useNotification();

  const toggleRightCanvas = () => {
    setOpen(!isOpen);
  };
  const {
    data: notificationsData,
    loading: notificationsLoading,
    error,
    refetch,
  } = useQuery(GET_ALL_NOTIFICATIONS, {
    variables: {
      input: {
        filter: "All",
      },
    },
    fetchPolicy: "network-only",
  });

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
        refetch();
      } else {
        console.log("not read");
      }
      refetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
    }
  };

  const [RemoveNotification] = useMutation(REMOVE_NOTIFICATION);

  const handleRemoveNotification = async (ID: any) => {
    try {
      const response = await RemoveNotification({
        variables: {
          input: {
            notificationId: ID,
          },
        },
      });
      console.log("REMOVE RESPONSE = ", response);
      if (response && response?.data?.addRemoveMarkNotification?.status) {
        console.log(response?.data?.addRemoveMarkNotification?.msg);
      } else {
        console.log("not read");
      }
      refetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
    }
  };

  console.log("NOTIFICATIONS = ", notificationsData);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserID(decoded?.id);
    }
  }, []);
  useEffect(() => {
    refetch();
  }, [isOpen]);
  useEffect(() => {
    console.log("useeffect enter");
    if (notificationsData && notificationsData?.getAllNotification?.allNotification) {
      console.log("if enter");
      setNotifications(notificationsData?.getAllNotification?.allNotification);
      updateCount(notificationsData?.getAllNotification?.unReadCount);
      // setUnreadCount(notificationsData?.getAllNotification?.unReadCount);
    }
  }, [notificationsData, refetch]);
  console.log("loading = ", notificationsLoading);

  console.log("count = ", unreadCount);

  return (
    <>
      <div>
        <Offcanvas
          isOpen={isOpen}
          direction="end"
          toggle={toggleRightCanvas}
        >
          <OffcanvasHeader toggle={toggleRightCanvas}>Notifications</OffcanvasHeader>
          <OffcanvasBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // gap:5,
              }}
            >
              {notifications && notifications?.length ? (
                notifications?.map((item: any, index) => (
                  <Link
                    key={index}
                    // to={"/orders/details?orderId=ORD-1738932462568"}
                    to={
                      item?.type === "new_order"
                        ? `/orders/details?orderId=${item?.orderId}`
                        : item?.type === "low_stock" || item?.type === "out_of_stock"
                        ? `/product/details/?_id=${item?.productId}`
                        : item?.type === "return_order"
                        ? `/return-orders/details?orderId=${item?.orderId}&_id=${item?.productId}`
                        : "/"
                    }
                    className="text-reset notification-item"
                    onClick={() => {
                      handleReadNotification(item?._id);
                      toggleRightCanvas();
                    }}
                    // style={{
                    //   boxShadow:"0 0 10px #eee",
                    //   borderRadius:5

                    // }}
                  >
                    <div
                      className="d-flex position-relative"
                      style={
                        item?.view?.length
                          ? {
                              // background: "#deffe8",
                              opacity: item?.view?.some((value: any) => value?.id === userID) ? "0.5" : "1",
                            }
                          : {}
                      }
                    >
                      {/* <div className="avatar-sm me-3">
                  <span className="avatar-title bg-primary rounded-circle font-size-16">
                    <i className="bx bx-cart" />
                  </span>
                </div> */}
                      <div className="flex-grow-1 ">
                        <h6 className="mt-0 mb-1">{item?.title}</h6>
                        {item?.view?.some((value: any) => value?.id === userID) ? (
                          <span
                            style={{ zIndex: 9999 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveNotification(item?._id);
                            }}
                          >
                            <FeatherIcon
                              icon="x"
                              className="icon-xs"
                              style={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                              }}
                            />
                          </span>
                        ) : null}
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
                <i className="text-muted font-size-12">No notifications yet. Stay tuned for updates!</i>
              )}
            </div>
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </>
  );
};

export default NotificationBar;
