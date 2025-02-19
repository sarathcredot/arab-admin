import React, { useEffect } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Import Routes all
import { adminRoutes, authRoutes } from "./routes/allRoutes";

//redux
import { useSelector } from "react-redux";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";
// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/index";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import "./assets/scss/preloader.scss";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// import fakeBackend from "./helpers/AuthType/fakeBackend";
import { createSelector } from "reselect";
import socket from "./socket";
import { toast, ToastContainer } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "./context/NotificationContext";

//api config
// import config from "./config";
// Activating fake backend
// fakeBackend();

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

// init firebase backend
// initFirebaseBackend(firebaseConfig);

export const ALL_NOTIFICATIONS_COUNT = gql`
  query AllNotification($input: getAllNotificationInput) {
    getAllNotification(input: $input) {
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

const App = () => {
  const navigate = useNavigate();
  const { setUnreadCount } = useNotification();
  const selectCalendar = createSelector(
    (state: any) => state.Layout,
    (state) => ({
      layoutType: state.layoutType,
    })
  );

  const { layoutType } = useSelector(selectCalendar);

  function getLayout() {
    let layoutCls: Object = VerticalLayout;
    switch (layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const { data: countData, refetch: countRefetch } = useQuery(ALL_NOTIFICATIONS_COUNT, {
    variables: {
      input: {
        filter: "",
      },
    },
    skip: !localStorage.getItem("admin_token"),
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
      } else {
        console.log("not read");
      }
      countRefetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
    }
  };

  const Layout: any = getLayout();

  const playSound = () => {
    const audio = new Audio("/sounds/notification_sound.mp3");
    audio.play().catch((err) => console.log("User interaction needed to enable sound", err));
  };

  const handleMessage = (data: any) => {
    playSound();
    toast(
      <div className="d-flex w-100">
        <div className="flex-grow-1 text-white">
          <h6 className="mt-0 mb-1">{data?.title}</h6>
          <div className="font-size-12 text-muted d-flex flex-column w-100 ">
            <p className="mb-1">{data?.message}</p>
            {/* <p className="mb-0"><i className="mdi mdi-clock-outline" /> {"3 min ago"}{" "}</p> */}
            <span
              className="mb-0"
              style={{ display: "flex", marginLeft: "auto" }}
            >
              {" "}
              {"Tap to view"}{" "}
            </span>
          </div>
        </div>
      </div>,
      {
        className: "text-black",
        onClick: () => {
          navigate(
            data?.type === "new_order"
              ? `/orders/details?orderId=${data?.orderId}`
              : data?.type === "low_stock"
              ? `/product/details/?_id=${data?.productId}`
              : data?.type === "return_order"
              ? `/return-orders/details?orderId=${data?.orderId}&_id=${data?.productId}`
              : "/"
          );
          handleReadNotification(data?._id);
        },
        closeOnClick: true,
        autoClose: 50000,
        style: {
          background:
            data?.type === "new_order" || data?.type === "return_order"
              ? "#deffe8"
              : data?.type === "low_stock"
              ? "#fffade"
              : data?.type === "out_of_stock"
              ? "#ffdede"
              : "#ffffff",
        },
        hideProgressBar: true,
        position: "top-right",
      }
    );
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    // Listen for notifications
    socket.on("new_notification", (data) => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const decoded: any = jwtDecode(token);
        console.log({ decoded });
        if (decoded?.accType === "SUB_ADMIN") {
          const hasPermission = data?.permissions?.some((item: any) => decoded?.role?.includes(item));

          if (hasPermission) {
            handleMessage(data);
          }
        } else {
          handleMessage(data);
        }
      } else {
        navigate("/login");
      }
      console.log("SOCKET = ", data);
      countRefetch();
    });

    return () => {
      socket.off("new_notification");
    };
  }, [socket]);

  useEffect(() => {
    console.log("count data useeffect");

    if (countData && countData?.getAllNotification?.unReadCount) {
      setUnreadCount(countData?.getAllNotification?.unReadCount);
    }
  }, [countData, countRefetch]);

  return (
    <React.Fragment>
      <Routes>
        {authRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <NonAuthLayout>{route.component}</NonAuthLayout>
              </Authmiddleware>
            }
            key={idx}
          />
        ))}

        {adminRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware path={route.path}>
                <Layout>{route.component}</Layout>
              </Authmiddleware>
            }
            key={idx}
          />
        ))}
      </Routes>
      <ToastContainer />
    </React.Fragment>
  );
};

export default App;
