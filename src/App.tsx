  import React, { useEffect } from "react";

  import { Routes, Route, Navigate } from "react-router-dom";

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
  import { createSelector } from 'reselect';

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

  const App = () => {

    const selectCalendar = createSelector(
      (state: any) => state.Layout,
      (state) => ({
        layoutType: state.layoutType,
      })
  );

  const { layoutType } = useSelector(selectCalendar);

  console.log(layoutType,"layoutType")

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

    const Layout: any = getLayout();

   




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
                <Authmiddleware>
                  <Layout>{route.component}</Layout>
                </Authmiddleware>
              }
              key={idx}
            />
          ))}
              
        </Routes>
      </React.Fragment>
    );
  };

  export default App;
