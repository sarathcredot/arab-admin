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
import { CiDeliveryTruck } from "react-icons/ci";
import { PiShoppingCartFill } from "react-icons/pi";
import { TbBrand4Chan } from "react-icons/tb";
import { TbTruckDelivery } from "react-icons/tb";
import { MdCategory, MdOutlineShoppingBag } from "react-icons/md";
import { MdEditAttributes } from "react-icons/md";
import { MdDomainVerification } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { BiSolidBookContent } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { LuShoppingBag } from "react-icons/lu";
import Iconify from "../iconify";

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
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1] ? parent.childNodes[1] : null;
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
      setOpenMenus((prevMenus) => [...prevMenus.filter((menu) => !menu.startsWith(parentPath)), itemPath]);
    }
    e.preventDefault();
  };

  const getParentPath = (itemPath: string) => {
    const segments = itemPath.split("/").filter(Boolean);
    segments.pop();
    return `/${segments.join("/")}`;
  };

  return (
    <React.Fragment>
      <SimpleBar
        style={{ maxHeight: "100%" }}
        ref={ref}
      >
        <div id="sidebar-menu">
          <ul
            className="metismenu list-unstyled"
            id="side-menu"
          >
            <li className="mt-3 li-sideBar">
              <Link
                to="/dashboard"
                className=""
              >
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
              <Link
                to="/users"
                className=""
              >
                <FeatherIcon icon="user" /> <span>{props.t("Users")}</span>
              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link
                to="/vendors"
                className=""
              >
                <FeatherIcon icon="users" /> <span>{props.t("Vendors")}</span>
              </Link>
            </li>

            {/* delivery boys */}

            {/* <li className="mt-3 li-sideBar">
              <Link to="/delivery-boys" className="">
                <FeatherIcon icon="users" />
                <span>{props.t("Delivery Boys")}</span>

              </Link>
            </li> */}
            <li className="mt-3  li-sideBar">
              <Link
                to="/delivery-boys"
                onClick={(e) => handleItemClick("/delivery-boys", e)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* <TbTruckDelivery /> */}
                    {/* <CiDeliveryTruck /> */}
                    <svg
                      fill="#000000"
                      height="800px"
                      width="800px"
                      version="1.1"
                      id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g>
                        <g>
                          <path
                            d="M376.608,176.569H261.832c-10.499,0-19.011,8.512-19.011,19.011v12.522l32.246,5.165
			c19.328,3.096,32.535,21.34,29.438,40.668c-2.39,14.923-13.991,26.716-28.868,29.348c-2.029,0.359-4.103,0.541-6.164,0.541
			c-1.879,0-3.775-0.151-5.637-0.45l-21.016-3.367v30.348c0,10.499,8.512,19.011,19.011,19.011h114.775
			c10.499,0,19.011-8.512,19.011-19.011V195.58C395.619,185.081,387.107,176.569,376.608,176.569z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M272.783,227.522l-71.944-11.524l-23.723-52.043l31.446,38.659l15.608,2.5v-55.358c0-16.287-13.203-29.49-29.49-29.49
			h-52.59c-16.287,0-29.49,13.203-29.49,29.49v151.54l9.544,76.98L80.741,478.767c-5.063,12.287,0.794,26.351,13.081,31.413
			c12.29,5.064,26.352-0.799,31.413-13.081l43.812-106.339c1.579-3.834,2.142-8.012,1.631-12.126l-7.529-60.729h18.688l6.775,51.876
			l-23.966,113.169c-2.753,13.001,5.554,25.771,18.554,28.524s25.772-5.556,28.524-18.554l24.819-117.191
			c0.565-2.663,0.672-5.402,0.32-8.101l-11.815-90.466l-44.307-7.097c-16.653-2.664-26.257-16.224-27.709-23.49l-12.038-60.296
			l26.195,57.47c2.927,6.419,8.87,10.947,15.835,12.062l83.096,13.31c10.296,1.65,20.129-4.482,23.328-14.169
			C293.536,242.566,285.55,229.567,272.783,227.522z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <circle
                            cx="168.617"
                            cy="63.533"
                            r="43.655"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M415.544,77.355H278.451c-9.684,0-17.535,7.851-17.535,17.535v47.823c0,9.684,7.851,17.535,17.535,17.535h137.093
			c9.684,0,17.535-7.851,17.535-17.535V94.89C433.079,85.206,425.228,77.355,415.544,77.355z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M353.302,0H308.92c-4.655,0-8.428,3.773-8.428,8.428V52.81c0,4.655,3.774,8.428,8.428,8.428h44.382
			c4.655,0,8.428-3.773,8.428-8.428V8.428C361.73,3.773,357.957,0,353.302,0z"
                          />
                        </g>
                      </g>
                    </svg>

                    <span>{props.t("Delivery")}</span>
                  </div>
                  <div
                    className="arrow-down"
                    style={{ position: "absolute", top: "30px", right: "25px" }}
                  ></div>
                </div>
              </Link>
              {openMenus.includes("/delivery-boys") && (
                <ul className={`sub-menu ${openMenus.includes("/delivery-boys") ? "mm-show" : ""}`}>
                  <li>
                    <Link to="/delivery-boys">
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Delivery Boys")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/settlement">
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Settlements")}</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mt-3 li-sideBar">
              <Link
                to="/kyc"
                className=""
              >
                <MdDomainVerification />

                <span>{props.t("KYC")}</span>
              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link
                to="/attributes"
                className=""
              >
                <MdEditAttributes />
                <span>{props.t("Attributes")}</span>
              </Link>
            </li>

            <li className="mt-3  li-sideBar">
              <Link
                to="/category"
                onClick={(e) => handleItemClick("/category", e)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MdCategory />

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
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Category List")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/assign-attribute">
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Assign Attribute")}</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mt-3 li-sideBar">
              <Link
                to="/brands"
                className=""
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TbBrand4Chan />

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
              <Link
                to="/product"
                className=" "
              >
                {/* <FeatherIcon icon="shopping-cart" /><span>{props.t("Products")}</span> */}
                <PiShoppingCartFill />
                <span>{props.t("Products")}</span>
              </Link>
            </li>

            {/* ORDERS */}

            <li className="mt-3 li-sideBar">
              <a
                href="/order-resolution"
                onClick={(e) => handleItemClick("/order-resolution", e)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MdOutlineShoppingBag />
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
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("All Orders")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-orders">
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Shipping Orders")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/return-orders">
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Return orders")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/refund-orders">
                      <FeatherIcon icon="chevron-right" /> <span>{props.t("Refund orders")}</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* COUPONS */}
            <li className="mt-3 li-sideBar">
              <Link
                to="/coupons"
                className=""
              >
                <RiCoupon2Line />

                <span>{props.t("Coupons")}</span>
              </Link>
            </li>

            <li className="mt-3 li-sideBar">
              <Link
                to="/cms"
                onClick={(e) => handleItemClick("/cms", e)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                      <FeatherIcon icon="chevron-right" />
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
              <Link
                to="/settings"
                className=""
              >
                <IoMdSettings />

                <span>{props.t("Settings")}</span>
              </Link>
            </li>
          </ul>
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
