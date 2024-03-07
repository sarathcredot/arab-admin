import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback, useState } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";

import withRouter from "../../../src/components/Common/withRouter";

const SidebarContent = (props: any) => {
  const ref = useRef<any>();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const activateParentDropdown = useCallback((item: any) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent?.childNodes[1];

    if (parent2El && parent2El?.id !== "side-menu") {
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

      if (item && item?.classList?.contains("active")) {
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

  function scrollElement(item: HTMLAnchorElement) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleItemClick = (itemPath: string, e: any) => {
    if (openMenus.includes(itemPath)) {
      setOpenMenus((prevMenus) => prevMenus.filter((menu) => menu !== itemPath));
    } else {
      const parentPath = getParentPath(itemPath);
      setOpenMenus((prevMenus) => [
        ...prevMenus.filter((menu) => !menu.startsWith(parentPath)),
        itemPath,
      ]);
    }
    e.preventDefault();
  };

  const getParentPath = (itemPath: string) => {
    const segments = itemPath.split('/').filter(Boolean);
    segments.pop();
    return `/${segments.join('/')}`;
  };


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

            <li className="mt-3 li-sideBar">
              <Link to="/users" className="">
                <FeatherIcon icon="user" />{" "}
                <span>{props.t("Users")}</span>

              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/vendors" className="">
                <FeatherIcon icon="users" />{" "}
                <span>{props.t("Vendors")}</span>

              </Link>
            </li>



            <li className="mt-3 li-sideBar">
              <Link to="/kyc" className="">
                <FeatherIcon icon="shield" />{" "}
                <span>{props.t("Kyc")}</span>

              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/attributes" className="">
                <FeatherIcon icon="pie-chart" />{" "}
                <span>{props.t("Attributes")}</span>
              </Link>
            </li>


            <li className="mt-3  li-sideBar" >
              <Link to="/category" onClick={(e) => handleItemClick("/category", e)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <FeatherIcon icon="shopping-bag" />
                    <span>{props.t("Categories")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>
              {openMenus.includes("/category") && (
                <ul className={`sub-menu ${openMenus.includes("/category") ? "mm-show" : ""}`}>
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
              )}
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/brandslist" className="">
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

            {/* ORDERS */}

            <li className="mt-3 li-sideBar" >
              <a href="/order-resolution" onClick={(e) => handleItemClick("/order-resolution", e)}>
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
              </a>
              {openMenus.includes("/order-resolution") && (
                <ul className={`sub-menu ${openMenus.includes("/order-resolution") ? "mm-show" : ""}`}>
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
              )}
            </li>


            <li className="mt-3 li-sideBar" >
              <Link to="/cms" onClick={(e) => handleItemClick("/cms", e)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <FeatherIcon icon="shopping-bag" />
                    <span>{props.t("CMS")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>
              {openMenus.includes("/cms") && (
                <ul className={`sub-menu ${openMenus.includes("/cms") ? "mm-show" : ""}`}>
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
              )}
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/settings" className="">
                <FeatherIcon icon="settings" />{" "}
                <span>{props.t("Settings")}</span>
              </Link>
            </li>
          </ul>

        </div>
      </SimpleBar >
    </React.Fragment >
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(SidebarContent));
