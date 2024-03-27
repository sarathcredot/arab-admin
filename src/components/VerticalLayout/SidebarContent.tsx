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

import { PiShoppingCartFill } from "react-icons/pi";
import { TbBrandApplePodcast } from "react-icons/tb";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdEditAttributes } from "react-icons/md";
import { MdDomainVerification } from "react-icons/md";
import { BiSolidBookContent } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";


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
                <MdDomainVerification />

                <span>{props.t("Kyc")}</span>

              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/attributes" className="">
                <MdEditAttributes />
                <span>{props.t("Attributes")}</span>
              </Link>
            </li>


            <li className="mt-3  li-sideBar" >
              <Link to="/category" onClick={(e) => handleItemClick("/category", e)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <BiSolidCategoryAlt />

                    <span>{props.t("Categories")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>
              {openMenus.includes("/category") && (
                <ul className={`sub-menu ${openMenus.includes("/category") ? "mm-show" : ""}`}
                >
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
              <Link to="/brands" className="">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <TbBrandApplePodcast />

                    <span>{props.t("Brands")}</span>
                  </div>
                </div>
              </Link>
              {/* <ul className="sub-menu">
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
              </ul> */}
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/product" className=" ">
                {/* <FeatherIcon icon="shopping-cart" /><span>{props.t("Products")}</span> */}
                <PiShoppingCartFill />
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
                    <BiSolidBookContent />

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
                      <span>{props.t("Pages")}</span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/cmstwolisting">
                      <FeatherIcon icon="chevron-right" />{" "}
                      <span>{props.t("collections")}</span>
                    </Link>
                  </li> */}
                </ul>
              )}
            </li>

            <li className="mt-3 li-sideBar">
              <Link to="/settings" className="">
                <IoMdSettings />

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
