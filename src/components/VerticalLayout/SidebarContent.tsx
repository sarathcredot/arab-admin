import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

//Import images
import giftBox from "../../assets/images/giftbox.png";

//i18n
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";

import withRouter from "../../../src/components/Common/withRouter";

const SidebarContent = (props: any) => {
  const ref: any = useRef();
  const activateParentDropdown = useCallback((item: any) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items: any) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;

    const ul: any = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");

    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      const itemPath = items[i].getAttribute("href");

      if (itemPath && (pathName === itemPath || pathName.startsWith(itemPath))) {
        activateParentDropdown(items[i]);
        break;
      }
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item: any) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }


  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">

            <li className="mt-3 li-sideBar">
              <Link to="/dashboard" className="">


                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.6087 13.6957V5.86958L7.82609 1.95654L13.0435 5.86958V13.6957H9.13044V9.13045H6.52174V13.6957H2.6087Z" />
                </svg>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>


            {/* <li className="mt-3 li-sideBar">
              <Link to="/colors" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Colors")}</span>
                
              </Link>
            </li> */}
            <li className="mt-3 li-sideBar">
              <Link to="/vendors" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Vendors")}</span>

              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/users" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Users")}</span>

              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/kyc" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Kyc")}</span>

              </Link>
            </li>





            <li className="mt-3  li-sideBar" >
              <Link to="/category" className="">

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <FeatherIcon icon="shopping-bag" />
                    <span>{props.t("Categories List")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>

              {/* <p
                  className="arrow-down"
                  style={{ marginLeft: "150px", height:"20px" }}
                ></p> */}

              <ul className="sub-menu " >
                <li>
                  <Link to="/category">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Category List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/assign-attribute">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Assign Attribute")}</span>
                  </Link>
                </li>
              </ul>

            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/brands" className="">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <FeatherIcon icon="shopping-bag" />
                    <span>{props.t("Brands")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>


              <ul className="sub-menu">
                <li>
                  <Link to="/brands">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Brand List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/assign-brands">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Assign Category")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* ORDERS */}
            <li className="mt-3 li-sideBar" >
              <Link to="/order-resolution" >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <FeatherIcon icon="shopping-bag" />
                    <span>{props.t("Order Resolution")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/orders">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("All Orders")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-orders">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Shipping Orders")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/return-orders">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Return orders")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/refund-orders">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Refund orders")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/attributes" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Attributes")}</span>
              </Link>
            </li>


            <li className="mt-3 li-sideBar">
              <Link to="/product" className=" ">
                {/* <FeatherIcon icon="shopping-cart" /><span>{props.t("Products")}</span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                >
                  <path d="M4.375 13.75V10H3.375C2.95833 10 2.60417 9.85417 2.3125 9.5625C2.02083 9.27083 1.875 8.91667 1.875 8.5C1.875 8.19792 1.95833 7.91927 2.125 7.66406C2.29167 7.40885 2.51042 7.21875 2.78125 7.09375L6.875 5.28125V4.875C6.5 4.73958 6.19792 4.51302 5.96875 4.19531C5.73958 3.8776 5.625 3.52083 5.625 3.125C5.625 2.60417 5.80729 2.16146 6.17188 1.79688C6.53646 1.43229 6.97917 1.25 7.5 1.25C8.02083 1.25 8.46354 1.43229 8.82812 1.79688C9.19271 2.16146 9.375 2.60417 9.375 3.125H8.125C8.125 2.94792 8.0651 2.79948 7.94531 2.67969C7.82552 2.5599 7.67708 2.5 7.5 2.5C7.32292 2.5 7.17448 2.5599 7.05469 2.67969C6.9349 2.79948 6.875 2.94792 6.875 3.125C6.875 3.30208 6.9349 3.45052 7.05469 3.57031C7.17448 3.6901 7.32292 3.75 7.5 3.75C7.67708 3.75 7.82552 3.8099 7.94531 3.92969C8.0651 4.04948 8.125 4.19792 8.125 4.375V5.28125L12.2188 7.09375C12.4896 7.21875 12.7083 7.40885 12.875 7.66406C13.0417 7.91927 13.125 8.19792 13.125 8.5C13.125 8.91667 12.9792 9.27083 12.6875 9.5625C12.3958 9.85417 12.0417 10 11.625 10H10.625V13.75H4.375ZM3.375 8.75H4.375V8.125H10.625V8.75H11.625C11.6979 8.75 11.7578 8.72396 11.8047 8.67188C11.8516 8.61979 11.875 8.55208 11.875 8.46875C11.875 8.41667 11.862 8.3724 11.8359 8.33594C11.8099 8.29948 11.7708 8.27083 11.7188 8.25L7.5 6.375L3.28125 8.25C3.22917 8.27083 3.1901 8.29948 3.16406 8.33594C3.13802 8.3724 3.125 8.41667 3.125 8.46875C3.125 8.55208 3.14844 8.61979 3.19531 8.67188C3.24219 8.72396 3.30208 8.75 3.375 8.75Z" />
                </svg>
                <span>{props.t("Products")}</span>
              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/settings" className="">
                <FeatherIcon icon="settings" />{" "}
                <span>{props.t("Settings")}</span>
              </Link>
            </li>

            {/* <li className="mt-3 li-sideBar">
              <Link to="/size" className="">
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                >
                  <path d="M2.33335 10.5C2.01252 10.5 1.73787 10.3858 1.5094 10.1573C1.28092 9.92882 1.16669 9.65417 1.16669 9.33333V4.66667C1.16669 4.34583 1.28092 4.07118 1.5094 3.84271C1.73787 3.61424 2.01252 3.5 2.33335 3.5H4.08335V7H5.25002V3.5H6.41669V7H7.58335V3.5H8.75002V7H9.91669V3.5H11.6667C11.9875 3.5 12.2622 3.61424 12.4906 3.84271C12.7191 4.07118 12.8334 4.34583 12.8334 4.66667V9.33333C12.8334 9.65417 12.7191 9.92882 12.4906 10.1573C12.2622 10.3858 11.9875 10.5 11.6667 10.5H2.33335Z" />
                </svg>
                <span>{props.t("Size")}</span>
              </Link>
            </li> */}


            {/* <li className="mt-3 li-sideBar" >
              <Link to="/product" >
                <FeatherIcon icon="home" /> <span>{props.t("CMS")}</span>
                <div
                  className="arrow-down"
                  style={{ marginLeft: "150px" }}
                ></div>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/cmslisting">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("Home Page")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cmstwolisting">
                    <FeatherIcon icon="chevron-right" />{" "}
                    <span>{props.t("collections")}</span>
                  </Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow">
                <FeatherIcon icon="grid" /> <span>{props.t("Apps")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/apps-calendar">{props.t("Calendar")}</Link>
                </li>
                <li>
                  <Link to="/apps-chat">{props.t("Chat")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <span>{props.t("Email")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/email-inbox">{props.t("Inbox")}</Link>
                    </li>
                    <li>
                      <Link to="/email-read">{props.t("Read Email")} </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <span>{props.t("Invoices")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/invoices-list">{props.t("Invoice List")}</Link>
                    </li>
                    <li>
                      <Link to="/invoices-detail">
                        {props.t("Invoice Detail")}
                      </Link>
                    </li>
                  </ul>
                </li>
              
                <li>
                  <Link to="/#" className="has-arrow ">
                    <span>{props.t("Contacts")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/contacts-grid">{props.t("User Grid")}</Link>
                    </li>
                    <li>
                      <Link to="/contacts-list">{props.t("User List")}</Link>
                    </li>
                    <li>
                      <Link to="/contacts-profile">{props.t("Profile")}</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <span className="badge rounded-pill badge-soft-danger text-danger float-end">
                      New
                    </span>
                    <span>{props.t("Blog")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/blog-grid">{props.t("Blog Grid")}</Link>
                    </li>
                    <li>
                      <Link to="/blog-list">{props.t("Blog List")}</Link>
                    </li>
                    <li>
                      <Link to="/blog-details">{props.t("Blog Details")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow">
                <FeatherIcon icon="users" /> <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/page-login">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="/page-register">{props.t("Register")}</Link>
                </li>
                <li>
                  <Link to="/page-recoverpw">
                    {props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="/page-lock-screen">{props.t("Lock Screen")}</Link>
                </li>
                <li>
                  <Link to="/page-logout">{props.t("Log Out")}</Link>
                </li>
                <li>
                  <Link to="/page-confirm-mail">{props.t("Confirm Mail")}</Link>
                </li>
                <li>
                  <Link to="/page-email-verification">
                    {props.t("Email Verification")}
                  </Link>
                </li>
                <li>
                  <Link to="/page-two-step-verification">
                    {props.t("Two Step Verification")}
                  </Link>
                </li>
              </ul>
            </li> */}
            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="file-text" /> <span>{props.t("Pages")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-starter">{props.t("Starter Page")}</Link>
                </li>
                <li>
                  <Link to="/pages-maintenance">{props.t("Maintenance")}</Link>
                </li>
                <li>
                  <Link to="/pages-comingsoon">{props.t("Coming Soon")}</Link>
                </li>
                <li>
                  <Link to="/pages-timeline">{props.t("Timeline")}</Link>
                </li>
                <li>
                  <Link to="/pages-faqs">{props.t("FAQs")}</Link>
                </li>
                <li>
                  <Link to="/pages-pricing">{props.t("Pricing")}</Link>
                </li>
                <li>
                  <Link to="/pages-404">{props.t("Error 404")}</Link>
                </li>
                <li>
                  <Link to="/pages-500">{props.t("Error 500")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li className="menu-title">{props.t("Elements")}</li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="briefcase" /> <span>{props.t("Components")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ui-alerts">{props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link to="/ui-buttons">{props.t("Buttons")}</Link>
                </li>
                <li>
                  <Link to="/ui-cards">{props.t("Cards")}</Link>
                </li>
                <li>
                  <Link to="/ui-carousel">{props.t("Carousel")}</Link>
                </li>
                <li>
                  <Link to="/ui-dropdowns">{props.t("Dropdowns")}</Link>
                </li>
                <li>
                  <Link to="/ui-grid">{props.t("Grid")}</Link>
                </li>
                <li>
                  <Link to="/ui-images">{props.t("Images")}</Link>
                </li>
                <li>
                  <Link to="/ui-modals">{props.t("Modals")}</Link>
                </li>
                <li>
                  <Link to="/ui-offcanvas">{props.t("Offcanvas")}</Link>
                </li>
                <li>
                  <Link to="/ui-progressbars">{props.t("Progress Bars")}</Link>
                </li>
                <li>
                  <Link to="/ui-placeholders">{props.t("Placeholders")}</Link>
                </li>
                <li>
                  <Link to="/ui-tabs-accordions">
                    {props.t("Tabs & Accordions")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-typography">{props.t("Typography")}</Link>
                </li>
                <li>
                  <Link to="/ui-toasts">{props.t("Toasts")}</Link>
                </li>
                <li>
                  <Link to="/ui-video">{props.t("Video")}</Link>
                </li>
                <li>
                  <Link to="/ui-general">{props.t("General")}</Link>
                </li>
                <li>
                  <Link to="/ui-colors">{props.t("Colors")}</Link>
                </li>
                <li>
                  <Link to="/ui-utilities">{props.t("Utilities")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="gift" /> <span>{props.t("Extended")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/extended-lightbox">{props.t("Lightbox")}</Link>
                </li>
                <li>
                  <Link to="/extended-rangeslider">
                    {props.t("Range Slider")}
                  </Link>
                </li>
                <li>
                  <Link to="/extended-session-timeout">
                    {props.t("Session Timeout")}
                  </Link>
                </li>
                <li>
                  <Link to="/extended-rating">{props.t("Rating")}</Link>
                </li>
                <li>
                  <Link to="/extended-notifications">
                    {props.t("Notifications")}
                  </Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="">
                <FeatherIcon icon="box" /> <span className="badge rounded-pill badge-soft-danger text-danger float-end">
                  7
                </span>
                <span>{props.t("Forms")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/form-elements">{props.t("Basic Elements")}</Link>
                </li>
                <li>
                  <Link to="/form-validation">{props.t("Validation")}</Link>
                </li>
                <li>
                  <Link to="/form-advanced">{props.t("Advanced Plugins")}</Link>
                </li>
                <li>
                  <Link to="/form-editors">{props.t("Editors")}</Link>
                </li>
                <li>
                  <Link to="/form-uploads">{props.t("File Upload")} </Link>
                </li>
                <li>
                  <Link to="/form-wizard">{props.t("Form Wizard")}</Link>
                </li>
                <li>
                  <Link to="/form-mask">{props.t("Form Mask")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="sliders" /> <span>{props.t("Tables")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/tables-basic">{props.t("Bootstrap Basic")}</Link>
                </li>
                <li>
                  <Link to="/tables-datatable">{props.t("DataTables")}</Link>
                </li>
                <li>
                  <Link to="/tables-responsive">{props.t("Responsive")}</Link>
                </li>
                <li>
                  <Link to="/tables-editable">{props.t("Editable")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="pie-chart" /> <span>{props.t("Charts")}</span>
              </Link>

              <ul className="sub-menu">
                <li>
                  <Link to="/charts-apex">{props.t("Apexcharts")}</Link>
                </li>
                <li>
                  <Link to="/charts-echart">{props.t("Echarts")}</Link>
                </li>
                <li>
                  <Link to="/charts-chartjs">{props.t("Chartjs")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="cpu" /> <span>{props.t("Icons")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/icons-boxicons">{props.t("Boxicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-materialdesign">
                    {props.t("Material Design")}
                  </Link>
                </li>
                <li>
                  <Link to="/icons-dripicons">{props.t("Dripicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-fontawesome">{props.t("Font awesome")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="map" /> <span>{props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/maps-google">{props.t("Google")}</Link>
                </li>
                <li>
                  <Link to="/maps-vector">{props.t("Vector")}</Link>
                </li>
                <li>
                  <Link to="/maps-leaflet">{props.t("Leaflet")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <FeatherIcon icon="share-2" /> <span>{props.t("Multi Level")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Level 1.1")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li> */}
          </ul>
          {/* <div className="card sidebar-alert border-0 text-center mx-4 mb-0 mt-5">
            <div className="card-body">
              <img src={giftBox} alt="" />
              <div className="mt-4">
                <h5 className="alertcard-title font-size-16">
                  Unlimited Access
                </h5>
                <p className="font-size-13">
                  Upgrade your plan from a Free trial, to select ‘Business
                  Plan’.
                </p>
                <a href="#!" className="btn btn-primary mt-2">
                  Upgrade Now
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(SidebarContent));
