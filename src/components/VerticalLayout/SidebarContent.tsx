import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { jwtDecode } from "jwt-decode";
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
  const [adminRoles, setAdminRoles] = useState<string[]>([]);
  const [adminType, setAdminType] = useState<string>("");

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

  // const sidebarItems = [
  //   {
  //     path: "/dashboard",
  //     label: "Dashboard",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="16"
  //         height="16"
  //         viewBox="0 0 16 16"
  //       >
  //         <path d="M2.6087 13.6957V5.86958L7.82609 1.95654L13.0435 5.86958V13.6957H9.13044V9.13045H6.52174V13.6957H2.6087Z" />
  //       </svg>
  //     ),
  //   },
  //   {
  //     path: "/users",
  //     label: "Users",
  //     icon: <FeatherIcon icon="user" />,
  //   },
  //   {
  //     path: "/vendors",
  //     label: "Vendors",
  //     icon: <FeatherIcon icon="users" />,
  //   },
  //   {
  //     path: "/delivery",
  //     label: "Delivery",
  //     icon: (
  //       <svg
  //         fill="#000000"
  //         height="800px"
  //         width="800px"
  //         version="1.1"
  //         id="Layer_1"
  //         xmlns="http://www.w3.org/2000/svg"
  //         xmlnsXlink="http://www.w3.org/1999/xlink"
  //         viewBox="0 0 512 512"
  //         xmlSpace="preserve"
  //       >
  //         <g>
  //           <g>
  //             <path
  //               d="M376.608,176.569H261.832c-10.499,0-19.011,8.512-19.011,19.011v12.522l32.246,5.165
	// 		c19.328,3.096,32.535,21.34,29.438,40.668c-2.39,14.923-13.991,26.716-28.868,29.348c-2.029,0.359-4.103,0.541-6.164,0.541
	// 		c-1.879,0-3.775-0.151-5.637-0.45l-21.016-3.367v30.348c0,10.499,8.512,19.011,19.011,19.011h114.775
	// 		c10.499,0,19.011-8.512,19.011-19.011V195.58C395.619,185.081,387.107,176.569,376.608,176.569z"
  //             />
  //           </g>
  //         </g>
  //         <g>
  //           <g>
  //             <path
  //               d="M272.783,227.522l-71.944-11.524l-23.723-52.043l31.446,38.659l15.608,2.5v-55.358c0-16.287-13.203-29.49-29.49-29.49
	// 		h-52.59c-16.287,0-29.49,13.203-29.49,29.49v151.54l9.544,76.98L80.741,478.767c-5.063,12.287,0.794,26.351,13.081,31.413
	// 		c12.29,5.064,26.352-0.799,31.413-13.081l43.812-106.339c1.579-3.834,2.142-8.012,1.631-12.126l-7.529-60.729h18.688l6.775,51.876
	// 		l-23.966,113.169c-2.753,13.001,5.554,25.771,18.554,28.524s25.772-5.556,28.524-18.554l24.819-117.191
	// 		c0.565-2.663,0.672-5.402,0.32-8.101l-11.815-90.466l-44.307-7.097c-16.653-2.664-26.257-16.224-27.709-23.49l-12.038-60.296
	// 		l26.195,57.47c2.927,6.419,8.87,10.947,15.835,12.062l83.096,13.31c10.296,1.65,20.129-4.482,23.328-14.169
	// 		C293.536,242.566,285.55,229.567,272.783,227.522z"
  //             />
  //           </g>
  //         </g>
  //         <g>
  //           <g>
  //             <circle
  //               cx="168.617"
  //               cy="63.533"
  //               r="43.655"
  //             />
  //           </g>
  //         </g>
  //         <g>
  //           <g>
  //             <path
  //               d="M415.544,77.355H278.451c-9.684,0-17.535,7.851-17.535,17.535v47.823c0,9.684,7.851,17.535,17.535,17.535h137.093
	// 		c9.684,0,17.535-7.851,17.535-17.535V94.89C433.079,85.206,425.228,77.355,415.544,77.355z"
  //             />
  //           </g>
  //         </g>
  //         <g>
  //           <g>
  //             <path
  //               d="M353.302,0H308.92c-4.655,0-8.428,3.773-8.428,8.428V52.81c0,4.655,3.774,8.428,8.428,8.428h44.382
	// 		c4.655,0,8.428-3.773,8.428-8.428V8.428C361.73,3.773,357.957,0,353.302,0z"
  //             />
  //           </g>
  //         </g>
  //       </svg>
  //     ),
  //     sub: [
  //       { path: "/delivery-boys", label: "Delivery Boys" },
  //       { path: "/settlement", label: "Settlements" },
  //     ],
  //   },
  //   {
  //     path: "/kyc",
  //     label: "KYC",
  //     icon: <MdDomainVerification />,
  //   },
  //   {
  //     path: "/attributes",
  //     label: "Attributes",
  //     icon: <MdCategory />,
  //     sub: [
  //       { path: "/category", label: "Category List" },
  //       { path: "/assign-attribute", label: "Assign Attribute" },
  //     ],
  //   },
  //   {
  //     path: "/brands",
  //     label: "brands",
  //     icon: <TbBrand4Chan />,
  //   },
  //   {
  //     path: "/product",
  //     label: "Products",
  //     icon: <PiShoppingCartFill />,
  //   },
  //   {
  //     path: "/order-resolution",
  //     label: "Order Resolution",
  //     icon: <MdOutlineShoppingBag />,
  //     sub: [
  //       { path: "/orders", label: "All Orders" },
  //       { path: "/shipping-orders", label: "Shipping Orders" },
  //       { path: "/return-orders", label: "Return Orders" },
  //       { path: "/refund-orders", label: "Refund Orders" },
  //     ],
  //   },
  //   {
  //     path: "/coupons",
  //     label: "Coupons",
  //     icon: <RiCoupon2Line />,
  //   },
  //   {
  //     path: "/cms",
  //     label: "CMS",
  //     icon: <BiSolidBookContent />,
  //     sub: [{ path: "/cmslisting", label: "Pages" }],
  //   },
  //   // Add other items similarly...
  // ];

  useEffect(() => {
    const token: any = localStorage.getItem("admin_token");
    const decoded: any = jwtDecode(token);
    console.log(decoded);
    if (decoded?.accType !== "SUPER_ADMIN" && decoded?.role?.length) {
      setAdminRoles(decoded?.role);
    }
    setAdminType(decoded?.accType);
  }, []);

  console.log("ADMIN ROLES = ", adminRoles);

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
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("dashboard") ? (
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
            ) : null}

            {adminType === "SUPER_ADMIN" || adminRoles?.includes("users") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/users"
                  className=""
                >
                  <FeatherIcon icon="user" /> <span>{props.t("Users")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("vendors") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/vendors"
                  className=""
                >
                  <FeatherIcon icon="users" /> <span>{props.t("Vendors")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" ||
            adminRoles?.includes("delivery-boys") ||
            adminRoles?.includes("settlement") ? (
              <li className="mt-3  li-sideBar">
                <Link
                  to="/delivery"
                  onClick={(e) => handleItemClick("/delivery", e)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                {openMenus.includes("/delivery") && (
                  <ul className={`sub-menu ${openMenus.includes("/delivery") ? "mm-show" : ""}`}>
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("delivery-boys") ? (
                      <li>
                        <Link to="/delivery-boys">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Delivery Boys")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("settlement") ? (
                      <li>
                        <Link to="/settlement">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Settlements")}</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("kyc") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/kyc"
                  className=""
                >
                  <MdDomainVerification />
                  <span>{props.t("KYC")}</span>
                </Link>
              </li>
            ) : null}

            {adminType === "SUPER_ADMIN" || adminRoles?.includes("kyc") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/attributes"
                  className=""
                >
                  <MdEditAttributes />
                  <span>{props.t("Attributes")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" ||
            adminRoles?.includes("category") ||
            adminRoles?.includes("assign-attribute") ? (
              <li className="mt-3  li-sideBar">
                <Link
                  to="/categories"
                  onClick={(e) => handleItemClick("/categories", e)}
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
                {openMenus.includes("/categories") && (
                  <ul className={`sub-menu ${openMenus.includes("/categories") ? "mm-show" : ""}`}>
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("category") ? (
                      <li>
                        <Link to="/category">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Category List")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("assign-attribute") ? (
                      <li>
                        <Link to="/assign-attribute">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Assign Attribute")}</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("brands") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/brands"
                  className=""
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TbBrand4Chan />

                      <span>{props.t("brands")}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("product") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/product"
                  className=" "
                >
                  <PiShoppingCartFill />
                  <span>{props.t("Products")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" ||
            adminRoles?.includes("orders") ||
            adminRoles?.includes("shipping-orders") ||
            adminRoles?.includes("return-orders") ||
            adminRoles?.includes("refund-orders") ? (
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
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("orders") ? (
                      <li>
                        <Link to="/orders">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("All Orders")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("shipping-orders") ? (
                      <li>
                        <Link to="/shipping-orders">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Shipping Orders")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("return-orders") ? (
                      <li>
                        <Link to="/return-orders">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Return orders")}</span>
                        </Link>
                      </li>
                    ) : null}

                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("refund-orders") ? (
                      <li>
                        <Link to="/refund-orders">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Refund orders")}</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("coupons") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/coupons"
                  className=""
                >
                  <RiCoupon2Line />

                  <span>{props.t("Coupons")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("cmslisting") ? (
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
                  </ul>
                )}
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("admins") || adminRoles?.includes("roles") ? (
              <li className="mt-3  li-sideBar">
                <Link
                  to="/admin-management"
                  onClick={(e) => handleItemClick("/admin-management", e)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FeatherIcon icon="shield" />
                      <span>{props.t("Admin Management")}</span>
                    </div>
                    <div
                      className="arrow-down"
                      style={{ position: "absolute", top: "30px", right: "25px" }}
                    ></div>
                  </div>
                </Link>
                {openMenus.includes("/admin-management") && (
                  <ul className={`sub-menu ${openMenus.includes("/admin-management") ? "mm-show" : ""}`}>
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("admins") ? (
                      <li>
                        <Link to="/admins">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Admins")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("roles") ? (
                      <li>
                        <Link to="/roles">
                          <FeatherIcon icon="chevron-right" /> <span>{props.t("Roles")}</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("settings") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/settings"
                  className=""
                >
                  <IoMdSettings />

                  <span>{props.t("Settings")}</span>
                </Link>
              </li>
            ) : null}
          </ul>
        </div>

        {/* <div id="sidebar-menu"> 
          <ul
            className="metismenu list-unstyled"
            id="side-menu"
          >
            {sidebarItems.map((item) => {
              const hasSub = item.sub && item.sub.length > 0;
              return (
                <li
                  className="mt-3 li-sideBar"
                  key={item.path}
                >
                  {hasSub ? (
                    <Link
                      to={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleItemClick(item.path, e);
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {item.icon}
                          <span>{props.t(item.label)}</span>
                        </div>
                        <div
                          className="arrow-down"
                          style={{ position: "absolute", top: "30px", right: "25px" }}
                        />
                      </div>
                    </Link>
                  ) : (
                    <Link to={item.path}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {item.icon}
                        <span>{props.t(item.label)}</span>
                      </div>
                    </Link>
                  )}
                  {hasSub && (
                    <ul className={`sub-menu ${openMenus.includes(item.path) ? "mm-show" : ""}`}>
                      {item.sub.map((subItem) => (
                        <li key={subItem.path}>
                          <Link to={subItem.path}>
                            <FeatherIcon icon="chevron-right" />
                            <span>{props.t(subItem.label)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div> */}
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(SidebarContent));
