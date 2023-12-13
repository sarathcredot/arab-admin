import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
  showRightSidebarAction,
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
const Layout = (props: any) => {
  const ref = useRef<any>();

  const dispatch = useDispatch();

  const selectLayoutState = (state: any) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      topbarTheme: layout.topbarTheme,
      layoutWidth: layout.layoutWidth,
      isPreloader: layout.isPreloader,
      leftSideBarTheme: layout.leftSideBarTheme,
      layoutType: layout.layoutType,
      layoutMode: layout.layoutMode,
      leftSideBarType: layout.leftSideBarType,
      showRightSidebar: layout.showRightSidebar,
    })
  );
  const {
    topbarTheme,
    layoutWidth,
    isPreloader,
    leftSideBarTheme,
    layoutType,
    layoutMode,
    leftSideBarType,
    showRightSidebar
  } = useSelector(selectLayoutProperties);

  const isMobile: any = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed"));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default"));
    }
  };

  //hides right sidebar on body click
  const hideRightbar = (event: any) => {
    var rightbar = document.getElementById("right-bar");
    //if clicked in inside right bar, then do nothing
    if (rightbar && rightbar.contains(event.target)) {
      return;
    } else {
      //if clicked in outside of rightbar then fire action for hide rightbar
      dispatch(showRightSidebarAction(false));
    }
  };

  // useEffect(() => {
  //   //init body click event fot toggle rightbar
  //   document.body.addEventListener("click", hideRightbar, true);

  //   if (isPreloader === true) {
  //     ref.current.style.display = "block";

  //     setTimeout(function () {
  //       if (ref.current) {
  //         ref.current.style.display = "none";
  //       }
  //     }, 1000);
  //   } else {
  //     ref.current.style.display = "none";
  //   }
  // }, [isPreloader]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [layoutMode, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);


  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  /*
  call dark/light mode
  */
  const onChangeLayoutMode = (value: any) => {
    if (changelayoutMode) {
      dispatch(changelayoutMode(value, layoutType));
      if (value === "dark") {
        dispatch(changeSidebarTheme("dark"));
      } else {
        dispatch(changeSidebarTheme("light"));
      }
    }
  };

  return (
    <React.Fragment>
      {/* <div className="pace pace-active" id="preloader" ref={ref}>
        <div
          className="pace-progress"
          data-progress-text="100%"
          data-progress="99"
          style={{ transform: "translate3d(100%, 0px, 0px)" }}
        >
          <div className="pace-progress-inner"></div>
        </div>
        <div className="pace-activity"></div>
      </div> */}

      <div id="layout-wrapper">
        <Header
          toggleMenuCallback={toggleMenuCallback}
          onChangeLayoutMode={onChangeLayoutMode}
        />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">
          {props.children}
          <Footer />
        </div>
      </div>
      {showRightSidebar ? (
        <RightSidebar onChangeLayoutMode={onChangeLayoutMode} />
      ) : null}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
  changelayoutMode: PropTypes.func,
};

export default Layout;
