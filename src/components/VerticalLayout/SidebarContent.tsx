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
import { GiReceiveMoney } from "react-icons/gi";
import { RiRefund2Fill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
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
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.6087 13.6957V5.86958L7.82609 1.95654L13.0435 5.86958V13.6957H9.13044V9.13045H6.52174V13.6957H2.6087Z" />
                  </svg> */}

                  <div className="icon_div">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.25 11.5C1.25 11.931 1.4212 12.3443 1.72595 12.649C2.0307 12.9538 2.44402 13.125 2.875 13.125H5.875C6.0884 13.125 6.29971 13.083 6.49686 13.0013C6.69401 12.9196 6.87315 12.7999 7.02405 12.649C7.32879 12.3443 7.5 11.931 7.5 11.5V9.75C7.5 9.31902 7.32879 8.9057 7.02405 8.60095C6.7193 8.29621 6.30598 8.125 5.875 8.125H2.875C2.44402 8.125 2.0307 8.29621 1.72595 8.60095C1.4212 8.9057 1.25 9.31902 1.25 9.75L1.25 11.5ZM8.75 11.5C8.75 11.931 8.9212 12.3443 9.22595 12.649C9.5307 12.9538 9.94402 13.125 10.375 13.125H12.125C12.556 13.125 12.9693 12.9538 13.274 12.649C13.5788 12.3443 13.75 11.931 13.75 11.5V9.75C13.75 9.31902 13.5788 8.9057 13.274 8.60095C12.9693 8.29621 12.556 8.125 12.125 8.125H10.375C9.94402 8.125 9.5307 8.29621 9.22595 8.60095C8.9212 8.9057 8.75 9.31902 8.75 9.75V11.5ZM1.25 5.25C1.25 5.68098 1.4212 6.0943 1.72595 6.39905C2.0307 6.70379 2.44402 6.875 2.875 6.875H4.625C5.05598 6.875 5.4693 6.70379 5.77405 6.39905C6.07879 6.0943 6.25 5.68098 6.25 5.25V3.5C6.25 3.2866 6.20797 3.07529 6.1263 2.87814C6.04464 2.68098 5.92494 2.50185 5.77405 2.35095C5.62315 2.20006 5.44401 2.08036 5.24686 1.9987C5.04971 1.91703 4.8384 1.875 4.625 1.875H2.875C2.6616 1.875 2.45029 1.91703 2.25314 1.9987C2.05599 2.08036 1.87685 2.20006 1.72595 2.35095C1.57506 2.50185 1.45536 2.68098 1.3737 2.87814C1.29203 3.07529 1.25 3.2866 1.25 3.5L1.25 5.25ZM7.5 5.25C7.5 5.68098 7.6712 6.0943 7.97595 6.39905C8.2807 6.70379 8.69402 6.875 9.125 6.875H12.125C12.556 6.875 12.9693 6.70379 13.274 6.39905C13.5788 6.0943 13.75 5.68098 13.75 5.25V3.5C13.75 3.2866 13.708 3.07529 13.6263 2.87814C13.5446 2.68098 13.4249 2.50185 13.274 2.35095C13.1232 2.20006 12.944 2.08036 12.7469 1.9987C12.5497 1.91703 12.3384 1.875 12.125 1.875H9.125C8.9116 1.875 8.70029 1.91703 8.50314 1.9987C8.30598 2.08036 8.12685 2.20006 7.97595 2.35095C7.82506 2.50185 7.70536 2.68098 7.62369 2.87814C7.54203 3.07529 7.5 3.2866 7.5 3.5V5.25Z"
                        // fill="#E30613"
                      />
                    </svg>
                  </div>
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
                  <div className="icon_div">
                    <FeatherIcon icon="users" />
                    {/* <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75 16.25C3.75 8.65608 9.90608 2.5 17.5 2.5C25.094 2.5 31.25 8.65608 31.25 16.25C31.25 23.8439 25.094 30 17.5 30C9.90608 30 3.75 23.8439 3.75 16.25Z"
                      // fill="white"
                    />
                    <path
                      d="M36.2497 16.25C36.2497 20.0009 35.1482 23.4945 33.2512 26.425C35.6935 28.6462 38.9385 30 42.4997 30C50.0937 30 56.2497 23.8439 56.2497 16.25C56.2497 8.65608 50.0937 2.5 42.4997 2.5C38.9385 2.5 35.6935 3.85383 33.2512 6.0749C35.1482 9.00553 36.2497 12.4992 36.2497 16.25Z"
                      // fill="white"
                    />
                    <path
                      d="M0 45C0 39.4773 4.47715 35 10 35H25C30.5228 35 35 39.4773 35 45V55C35 56.3808 33.8807 57.5 32.5 57.5H2.5C1.11929 57.5 0 56.3808 0 55V45Z"
                      // fill="white"
                    />
                    <path
                      d="M39.9999 45V57.5H57.4999C58.8804 57.5 59.9999 56.3808 59.9999 55V45C59.9999 39.4773 55.5227 35 49.9999 35H36.1804C38.5554 37.6537 39.9999 41.1582 39.9999 45Z"
                      // fill="white"
                    />
                  </svg> */}
                  </div>
                  <span>{props.t("Users")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("vendors") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/vendors"
                  className=""
                >
                  <div className="icon_div">
                    {/* <FeatherIcon icon="users" />  */}
                    <svg
                      width="63"
                      height="54"
                      viewBox="0 0 63 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M56.0411 20.0581C56.4483 20.0589 56.8406 20.2113 57.1414 20.4856C57.4423 20.76 57.6301 21.1366 57.6683 21.542V44.619C57.6645 45.884 57.1749 47.0991 56.3007 48.0133C55.4265 48.9275 54.2345 49.4709 52.971 49.5312H20.0184C18.7535 49.5274 17.5384 49.0378 16.6242 48.1636C15.71 47.2894 15.1666 46.0974 15.1062 44.834V21.6955C15.107 21.2883 15.2594 20.8961 15.5338 20.5952C15.8081 20.2943 16.1847 20.1065 16.5901 20.0683H56.0411V20.0581ZM43.3615 26.884L43.249 26.9659L33.8749 37.128L29.6279 33.0345C29.4124 32.8187 29.1244 32.6908 28.8199 32.6757C28.5153 32.6606 28.216 32.7593 27.9802 32.9526L27.8779 33.0345L26.1586 34.59C26.0534 34.6791 25.9672 34.7886 25.9053 34.9118C25.8435 35.0351 25.8071 35.1696 25.7985 35.3072C25.7899 35.4448 25.8092 35.5828 25.8553 35.7128C25.9013 35.8428 25.9732 35.9621 26.0665 36.0637L26.1586 36.166L32.1556 41.8457C32.6227 42.3056 33.2501 42.5662 33.9056 42.5723C34.2319 42.581 34.5565 42.5207 34.858 42.3955C35.1595 42.2703 35.4313 42.083 35.6555 41.8457L40.6701 36.5651L41.0692 36.1455L41.6013 35.5827L46.7182 30.1588C46.894 29.9523 46.9996 29.6954 47.0198 29.425C47.0401 29.1546 46.9739 28.8848 46.8308 28.6544L46.7591 28.5623L44.9989 26.9863C44.7878 26.7683 44.5029 26.637 44.2001 26.6181C43.8972 26.5991 43.5981 26.694 43.3615 26.884ZM56.0411 3.68414C57.3431 3.68685 58.591 4.20525 59.5116 5.12588C60.4322 6.04651 60.9506 7.29437 60.9533 8.59633V13.5085C60.9533 13.9428 60.7808 14.3593 60.4737 14.6663C60.1667 14.9734 59.7502 15.1459 59.3159 15.1459H13.4688C13.0346 15.1459 12.6181 14.9734 12.311 14.6663C12.0039 14.3593 11.8314 13.9428 11.8314 13.5085V8.59633C11.8341 7.29437 12.3525 6.04651 13.2732 5.12588C14.1938 4.20525 15.4416 3.68685 16.7436 3.68414H56.0411Z"
                        // fill="white"
                      />
                      <path
                        d="M37.8557 43.0047L28.8756 45.0668L22.8889 37.3505L25.8823 32.3616L29.4743 31.3638L32.634 34.0911L43.6762 25.3771L50.2616 29.9336L37.8557 43.0047Z"
                        // fill="white"
                        // stroke="white"
                      />
                      <path
                        d="M5.97522 22.4392C5.97522 16.4142 10.8594 11.53 16.8844 11.53C22.9094 11.53 27.7935 16.4142 27.7935 22.4392C27.7935 28.4641 22.9094 33.3483 16.8844 33.3483C10.8594 33.3483 5.97522 28.4641 5.97522 22.4392Z"
                        // fill="white"
                        // stroke="#9F9F9F"
                        strokeWidth="4.5"
                      />
                      <path
                        d="M3 41.7236C3 37.3419 6.55214 33.7897 10.9339 33.7897H22.8348C27.2165 33.7897 30.7688 37.3419 30.7688 41.7236V49.6575C30.7688 50.753 29.8807 51.641 28.7853 51.641H4.98348C3.88804 51.641 3 50.753 3 49.6575V41.7236Z"
                        // fill="white"
                        // stroke="#9F9F9F"
                        strokeWidth="4.5"
                      />
                    </svg>
                  </div>
                  <span>{props.t("Vendors")}</span>
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
                      <div className="icon_div">
                        {/* <svg
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
                      </svg> */}
                        <svg
                          width="60"
                          height="41"
                          viewBox="0 0 60 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M47.0946 40.6723C50.6414 40.6723 53.5166 37.7971 53.5166 34.2504C53.5166 30.7036 50.6414 27.8284 47.0946 27.8284C43.5478 27.8284 40.6726 30.7036 40.6726 34.2504C40.6726 37.7971 43.5478 40.6723 47.0946 40.6723Z"
                            // fill="white"
                          />
                          <path
                            d="M12.844 40.6725C16.3908 40.6725 19.266 37.7972 19.266 34.2505C19.266 30.7037 16.3908 27.8285 12.844 27.8285C9.29722 27.8285 6.422 30.7037 6.422 34.2505C6.422 37.7972 9.29722 40.6725 12.844 40.6725Z"
                            // fill="white"
                          />
                          <path
                            d="M59.5104 20.1222L50.9478 9.41891C50.5196 8.77671 49.8774 8.56264 49.2352 8.56264H38.5319V2.14066C38.5319 0.856264 37.6757 0 36.3913 0H32.1099V2.14066C32.1099 4.06726 31.2537 5.77979 29.9693 6.85012V12.844C29.9693 16.4831 27.1864 19.266 23.5473 19.266H2.14066C1.2844 19.266 0.642199 19.0519 0 18.8378V34.2506C0 35.535 0.856265 36.3912 2.14066 36.3912H2.35473C2.14066 35.749 2.14066 34.8928 2.14066 34.2506C2.14066 28.2567 6.85012 23.5473 12.844 23.5473C18.8378 23.5473 23.5473 28.2567 23.5473 34.2506C23.5473 34.8928 23.5473 35.749 23.3332 36.3912H36.3913H36.6053C36.3913 35.749 36.3913 34.8928 36.3913 34.2506C36.3913 28.2567 41.1007 23.5473 47.0946 23.5473C53.0884 23.5473 57.7979 28.2567 57.7979 34.2506C57.7979 34.8928 57.7979 35.749 57.5838 36.3912H57.7979C59.0823 36.3912 59.9386 35.535 59.9386 34.2506V21.4066C59.9386 20.9785 59.7245 20.5503 59.5104 20.1222Z"
                            // fill="white"
                          />
                          <path
                            d="M0 3C0 1.34315 1.34315 0 3 0H36.5867V19.9564H0V3Z"
                            // fill="white"
                          />
                        </svg>
                      </div>
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
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Delivery Boys")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("settlement") ? (
                      <li>
                        <Link to="/settlement">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Settlements")}</span>
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
                  <div className="icon_div">
                  {/* <MdDomainVerification /> */}
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M34.9676 29.0625C35.0599 29.0626 35.1502 29.0354 35.2272 28.9843C35.3041 28.9332 35.3643 28.8606 35.4001 28.7755C35.4359 28.6903 35.4457 28.5965 35.4284 28.5058C35.4111 28.4151 35.3674 28.3315 35.3027 28.2656L26.1152 18.9234C26.0499 18.8571 25.9664 18.8117 25.8752 18.7931C25.7841 18.7744 25.6894 18.7833 25.6033 18.8186C25.5173 18.854 25.4436 18.9141 25.3918 18.9914C25.34 19.0687 25.3124 19.1597 25.3125 19.2527V27.6562C25.3125 28.0292 25.4607 28.3869 25.7244 28.6506C25.9881 28.9143 26.3458 29.0625 26.7188 29.0625H34.9676Z"
                        // fill="white"
                      />
                      <path
                        d="M23.0859 31.2891C22.6046 30.8142 22.2222 30.2487 21.9607 29.6251C21.6992 29.0016 21.5639 28.3324 21.5625 27.6562V16.875H13.125C11.1377 16.8809 9.23344 17.6729 7.82819 19.0782C6.42294 20.4834 5.63087 22.3877 5.625 24.375V50.625C5.625 52.6141 6.41518 54.5218 7.8217 55.9283C9.22822 57.3348 11.1359 58.125 13.125 58.125H30C31.9891 58.125 33.8968 57.3348 35.3033 55.9283C36.7098 54.5218 37.5 52.6141 37.5 50.625V32.8125H26.7188C26.0425 32.8115 25.3733 32.6764 24.7497 32.4149C24.1261 32.1534 23.5606 31.7707 23.0859 31.2891Z"
                        // fill="white"
                      />
                      <path
                        d="M43.5938 14.0625H51.8426C51.9349 14.0626 52.0252 14.0354 52.1022 13.9843C52.1791 13.9332 52.2393 13.8606 52.2751 13.7755C52.3109 13.6903 52.3207 13.5965 52.3034 13.5058C52.2861 13.4151 52.2424 13.3315 52.1777 13.2656L42.9902 3.92341C42.9249 3.85711 42.8414 3.81175 42.7502 3.79309C42.6591 3.77443 42.5644 3.78333 42.4783 3.81864C42.3923 3.85396 42.3186 3.91409 42.2668 3.99139C42.215 4.06869 42.1874 4.15966 42.1875 4.25271V12.6562C42.1875 13.0292 42.3357 13.3869 42.5994 13.6506C42.8631 13.9143 43.2208 14.0625 43.5938 14.0625Z"
                        // fill="white"
                      />
                      <path
                        d="M43.5938 17.8125C42.2295 17.8021 40.924 17.2555 39.9593 16.2908C38.9945 15.326 38.4479 14.0206 38.4375 12.6562V1.875H25.7813C23.9171 1.87717 22.1299 2.61866 20.8118 3.9368C19.4937 5.25495 18.7522 7.04211 18.75 8.90625V13.125H23.6859C24.316 13.1275 24.9393 13.2545 25.5201 13.4986C26.1009 13.7428 26.6277 14.0993 27.0703 14.5477L39.8625 27.5555C40.7549 28.461 41.2533 29.6825 41.2488 30.9539V46.875H47.4656C51.2754 46.875 54.3738 43.7203 54.3738 39.8438V17.8125H43.5938Z"
                        // fill="white"
                      />
                    </svg>
                  </div>

                  <span>{props.t("KYC")}</span>
                </Link>
              </li>
            ) : null}

            {adminType === "SUPER_ADMIN" || adminRoles?.includes("attributes") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/attributes"
                  className=""
                >
                  <div className="icon_div">
                    {/* <MdEditAttributes /> */}
                    <svg
                      width="55"
                      height="55"
                      viewBox="0 0 55 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_10055_1098)">
                        <path
                          d="M53.8469 29.7183L25.2818 1.15324C24.374 0.243918 23.0793 -0.161974 21.8112 0.0614238L6.05066 2.86806C4.42709 3.15753 3.15592 4.4287 2.86645 6.05227L0.0613864 21.8129C-0.163585 23.0793 0.243881 24.3741 1.15321 25.2834L29.7167 53.8469C30.4844 54.6131 31.4913 54.9969 32.4982 54.9969C33.5082 54.9969 34.5119 54.6131 35.2828 53.8469L53.8516 35.2765C55.3839 33.7426 55.3839 31.2522 53.8469 29.7183ZM14.8293 14.8749C13.256 16.4246 10.7247 16.4057 9.17509 14.834C7.62546 13.2608 7.64276 10.7295 9.21599 9.17827C10.7892 7.62864 13.3205 7.64752 14.8717 9.22075C16.4214 10.7908 16.4009 13.3222 14.8293 14.8749Z"
                          // fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10055_1098">
                          <rect
                            width="55"
                            height="55"
                            // fill="white"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

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
                      {/* <MdCategory /> */}
                      <div className="icon_div">
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_10055_1102)">
                            <path
                              d="M29.9999 2.49999C29.5705 2.51842 29.1521 2.64204 28.7816 2.86C28.4111 3.07795 28.0997 3.38357 27.8749 3.74999L16.4999 21.25C16.3117 21.6398 16.214 22.0671 16.214 22.5C16.214 22.9329 16.3117 23.3602 16.4999 23.75C16.7058 24.1329 17.0128 24.4519 17.3876 24.6723C17.7623 24.8927 18.1903 25.0061 18.6249 25H41.2499C41.6794 24.9816 42.0978 24.8579 42.4683 24.64C42.8388 24.422 43.1502 24.1164 43.3749 23.75C43.6222 23.38 43.7541 22.945 43.7541 22.5C43.7541 22.055 43.6222 21.62 43.3749 21.25L32.1249 3.74999C31.9191 3.36711 31.612 3.04808 31.2373 2.82766C30.8626 2.60725 30.4346 2.49391 29.9999 2.49999Z"
                              // fill="white"
                            />
                            <path
                              d="M53.75 53.75H36.25C35.587 53.75 34.9511 53.4866 34.4822 53.0178C34.0134 52.5489 33.75 51.913 33.75 51.25V33.75C33.75 33.087 34.0134 32.4511 34.4822 31.9822C34.9511 31.5134 35.587 31.25 36.25 31.25H53.75C54.413 31.25 55.0489 31.5134 55.5178 31.9822C55.9866 32.4511 56.25 33.087 56.25 33.75V51.25C56.25 51.913 55.9866 52.5489 55.5178 53.0178C55.0489 53.4866 54.413 53.75 53.75 53.75Z"
                              // fill="white"
                            />
                            <path
                              d="M16.25 30C13.7777 30 11.361 30.7331 9.30538 32.1066C7.24976 33.4801 5.64761 35.4324 4.70151 37.7165C3.75542 40.0005 3.50787 42.5139 3.99019 44.9386C4.4725 47.3634 5.66301 49.5907 7.41117 51.3388C9.15933 53.087 11.3866 54.2775 13.8114 54.7598C16.2361 55.2421 18.7495 54.9946 21.0335 54.0485C23.3176 53.1024 25.2699 51.5002 26.6434 49.4446C28.0169 47.389 28.75 44.9723 28.75 42.5C28.75 40.8585 28.4267 39.233 27.7985 37.7165C27.1703 36.1999 26.2496 34.8219 25.0888 33.6612C23.9281 32.5004 22.5501 31.5797 21.0335 30.9515C19.517 30.3233 17.8915 30 16.25 30Z"
                              // fill="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_10055_1102">
                              <rect
                                width="60"
                                height="60"
                                // fill="white"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

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
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Category List")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("assign-attribute") ? (
                      <li>
                        <Link to="/assign-attribute">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Assign Attribute")}</span>
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
                      <div className="icon_div">
                        {/* <TbBrand4Chan /> */}
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 16.194C5 12.752 5 11.031 5.5542 9.67053C6.31612 7.80018 7.80018 6.31612 9.67053 5.5542C11.031 5 12.752 5 16.194 5C19.6361 5 21.3571 5 22.7176 5.5542C24.5879 6.31612 26.072 7.80018 26.834 9.67053C27.388 11.031 27.388 12.752 27.388 16.194C27.388 19.6361 27.388 21.3571 26.834 22.7176C26.072 24.5879 24.5879 26.072 22.7176 26.834C21.3571 27.388 19.6361 27.388 16.194 27.388C12.752 27.388 11.031 27.388 9.67053 26.834C7.80018 26.072 6.31612 24.5879 5.5542 22.7176C5 21.3571 5 19.6361 5 16.194Z"
                            // fill="white"
                          />
                          <path
                            d="M5 43.8061C5 40.3641 5 38.6431 5.5542 37.2826C6.31612 35.4123 7.80018 33.9281 9.67053 33.1663C11.031 32.6121 12.752 32.6121 16.194 32.6121C19.6361 32.6121 21.3571 32.6121 22.7176 33.1663C24.5879 33.9281 26.072 35.4123 26.834 37.2826C27.388 38.6431 27.388 40.3641 27.388 43.8061C27.388 47.2481 27.388 48.9691 26.834 50.3296C26.072 52.2001 24.5879 53.6841 22.7176 54.4458C21.3571 55.0001 19.6361 55.0001 16.194 55.0001C12.752 55.0001 11.031 55.0001 9.67053 54.4458C7.80018 53.6841 6.31612 52.2001 5.5542 50.3296C5 48.9691 5 47.2481 5 43.8061Z"
                            // fill="white"
                          />
                          <path
                            d="M32.6123 43.8061C32.6123 40.3641 32.6123 38.6431 33.1666 37.2826C33.9286 35.4123 35.4126 33.9281 37.2828 33.1663C38.6433 32.6121 40.3643 32.6121 43.8063 32.6121C47.2486 32.6121 48.9696 32.6121 50.3298 33.1663C52.2003 33.9281 53.6843 35.4123 54.4463 37.2826C55.0006 38.6431 55.0006 40.3641 55.0006 43.8061C55.0006 47.2481 55.0006 48.9691 54.4463 50.3296C53.6843 52.2001 52.2003 53.6841 50.3298 54.4458C48.9696 55.0001 47.2486 55.0001 43.8063 55.0001C40.3643 55.0001 38.6433 55.0001 37.2828 54.4458C35.4126 53.6841 33.9286 52.2001 33.1666 50.3296C32.6123 48.9691 32.6123 47.2481 32.6123 43.8061Z"
                            // fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M41.9313 23.6941C41.9313 24.7296 42.7705 25.5692 43.8063 25.5692C44.8418 25.5692 45.6813 24.7296 45.6813 23.6941V18.0691H51.3063C52.3418 18.0691 53.1813 17.2296 53.1813 16.1941C53.1813 15.1586 52.3418 14.3191 51.3063 14.3191H45.6813V8.69409C45.6813 7.65857 44.8418 6.81909 43.8063 6.81909C42.7705 6.81909 41.9313 7.65857 41.9313 8.69409V14.3191H36.3063C35.2705 14.3191 34.4313 15.1586 34.4313 16.1941C34.4313 17.2296 35.2705 18.0691 36.3063 18.0691H41.9313V23.6941Z"
                            // fill="white"
                          />
                        </svg>
                      </div>

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
                  <div className="icon_div">
                    <PiShoppingCartFill />
                  </div>
                  <span>{props.t("Products")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" ||
            ["orders", "shipping-orders", "return-orders", "refund-orders"].some((role) =>
              adminRoles?.includes(role)
            ) ? (
              <li className="mt-3 li-sideBar">
                <a
                  href="/order-resolution"
                  onClick={(e) => handleItemClick("/order-resolution", e)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="icon_div">
                        {/* <MdOutlineShoppingBag /> */}
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M50.5255 19.5499L31.2755 30.6999C30.5005 31.1499 29.5255 31.1499 28.7255 30.6999L9.47554 19.5499C8.10054 18.7499 7.75054 16.8749 8.80054 15.6999C9.52554 14.8749 10.3505 14.1999 11.2255 13.7249L24.7755 6.22485C27.6755 4.59985 32.3755 4.59985 35.2755 6.22485L48.8255 13.7249C49.7005 14.1999 50.5255 14.8999 51.2505 15.6999C52.2505 16.8749 51.9005 18.7499 50.5255 19.5499Z"
                            // fill="white"
                          />
                          <path
                            d="M28.5742 35.3495V52.3995C28.5742 54.2995 26.6492 55.5495 24.9492 54.7245C19.7992 52.1995 11.1242 47.4745 11.1242 47.4745C8.07422 45.7495 5.57422 41.3995 5.57422 37.8245V24.9245C5.57422 22.9495 7.64922 21.6995 9.34922 22.6745L27.3242 33.0995C28.0742 33.5745 28.5742 34.4245 28.5742 35.3495Z"
                            // fill="white"
                          />
                          <path
                            d="M31.4248 35.3495V52.3995C31.4248 54.2995 33.3498 55.5495 35.0498 54.7245C40.1998 52.1995 48.8748 47.4745 48.8748 47.4745C51.9248 45.7495 54.4248 41.3995 54.4248 37.8245V24.9245C54.4248 22.9495 52.3498 21.6995 50.6498 22.6745L32.6748 33.0995C31.9248 33.5745 31.4248 34.4245 31.4248 35.3495Z"
                            // fill="white"
                          />
                        </svg>
                      </div>

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
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("All Orders")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("shipping-orders") ? (
                      <li>
                        <Link to="/shipping-orders">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Shipping Orders")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("return-orders") ? (
                      <li>
                        <Link to="/return-orders">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Return orders")}</span>
                        </Link>
                      </li>
                    ) : null}

                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("refund-orders") ? (
                      <li>
                        <Link to="/refund-orders">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Refund orders")}</span>
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
                  <div className="icon_div">
                    {/* <RiCoupon2Line /> */}
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_10055_1123)">
                        <path
                          d="M47.5 10C51.4943 10 54.7592 13.1223 54.9873 17.0593L55 17.5V22.0428C55 23.5587 54.1192 24.7384 53.0601 25.3666L52.792 25.512C51.1327 26.3307 50 28.0355 50 30C50 31.8242 50.9767 33.4244 52.4447 34.2992L52.792 34.488C53.8759 35.0227 54.8401 36.127 54.9821 37.5854L55 37.9573V42.5C55 46.4943 51.8778 49.7592 47.9407 49.9873L47.5 50H12.5C8.50581 50 5.24085 46.8778 5.01273 42.9407L5 42.5V37.9573C5 36.4413 5.88083 35.2615 6.93988 34.6334L7.20795 34.488C8.86727 33.6693 10 31.9645 10 30C10 28.1758 9.02331 26.5756 7.55524 25.7008L7.20795 25.512C6.12407 24.9773 5.15987 23.873 5.01794 22.4147L5 22.0428V17.5C5 13.5058 8.12231 10.2408 12.0593 10.0127L12.5 10H47.5ZM25 22.5C23.6193 22.5 22.5 23.6193 22.5 25V35C22.5 36.3808 23.6193 37.5 25 37.5C26.3807 37.5 27.5 36.3808 27.5 35V25C27.5 23.6193 26.3807 22.5 25 22.5Z"
                          // fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10055_1123">
                          <rect
                            width="60"
                            height="60"
                            // fill="white"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
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
                      <div className="icon_div">
                        {/* <BiSolidBookContent /> */}
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M50.625 7.5H9.375C6.1875 7.5 3.75 9.9375 3.75 13.125V46.875C3.75 50.0625 6.1875 52.5 9.375 52.5H14.8125C13.875 52.5 13.125 51.9375 12.9375 51C12.5625 49.6875 12.375 48.1875 12.375 46.875C12.375 45.5625 12.5625 44.25 12.9375 42.75C13.125 41.8125 14.0625 41.25 15 41.4375C16.125 41.625 17.25 41.0625 18 39.9375C18.5625 39 18.5625 37.6875 17.8125 36.75C17.25 36 17.25 34.875 18 34.3125C20.0625 32.4375 22.5 30.9375 25.125 30.1875C26.0625 30 27 30.375 27.375 31.3125C27.75 32.4375 28.875 33.1875 30 33.1875C31.125 33.1875 32.25 32.4375 32.625 31.3125C33 30.375 33.9375 30 34.875 30.1875C37.5 30.9375 39.9375 32.4375 42 34.3125C42.75 35.0625 42.75 36 42.1875 36.75C41.4375 37.6875 41.4375 39 42 39.9375C42.5625 40.875 43.6875 41.625 45 41.4375C45.9375 41.25 46.875 42 47.0625 42.9375C47.4375 44.25 47.625 45.75 47.625 47.0625C47.625 48.375 47.4375 49.875 47.0625 51.1875C46.875 51.9375 46.125 52.6875 45.1875 52.6875H50.625C53.8125 52.6875 56.25 50.25 56.25 47.0625V13.125C56.25 9.9375 53.8125 7.5 50.625 7.5ZM14.8125 15.75C14.8125 15.9375 14.625 16.125 14.4375 16.3125C14.0625 16.6875 13.6875 16.875 13.125 16.875C12.5625 16.875 12.1875 16.6875 11.8125 16.3125C11.4375 15.9375 11.25 15.5625 11.25 15C11.25 14.4375 11.4375 14.0625 11.8125 13.6875L12 13.5C12.1875 13.5 12.1875 13.3125 12.375 13.3125C12.5625 13.125 12.5625 13.125 12.75 13.125C12.9375 13.125 13.3125 13.125 13.5 13.125C13.6875 13.125 13.6875 13.125 13.875 13.3125C14.0625 13.3125 14.0625 13.5 14.25 13.5L14.4375 13.6875C14.625 13.875 14.8125 14.0625 14.8125 14.25C15 14.4375 15 14.8125 15 15C15 15.1875 15 15.5625 14.8125 15.75ZM20.0625 16.3125C19.6875 16.6875 19.3125 16.875 18.75 16.875C18.1875 16.875 17.8125 16.6875 17.4375 16.3125C17.0625 15.9375 16.875 15.5625 16.875 15C16.875 14.8125 16.875 14.4375 17.0625 14.25C17.25 14.0625 17.25 13.875 17.4375 13.6875C17.625 13.5 17.8125 13.3125 18 13.3125C18.75 12.9375 19.5 13.125 20.0625 13.6875C20.25 13.875 20.4375 14.0625 20.4375 14.25C20.625 14.4375 20.625 14.8125 20.625 15C20.625 15.5625 20.4375 15.9375 20.0625 16.3125ZM26.0625 15.75C25.875 15.9375 25.875 16.125 25.6875 16.3125C25.3125 16.6875 24.9375 16.875 24.375 16.875C24.1875 16.875 23.8125 16.875 23.625 16.6875C23.4375 16.5 23.25 16.5 23.0625 16.3125C22.875 16.125 22.6875 15.9375 22.6875 15.75C22.5 15.5625 22.5 15.1875 22.5 15C22.5 14.8125 22.5 14.4375 22.6875 14.25C22.875 14.0625 22.875 13.875 23.0625 13.6875C23.8125 12.9375 24.9375 12.9375 25.6875 13.6875C25.875 13.875 26.0625 14.0625 26.0625 14.25C26.25 14.4375 26.25 14.8125 26.25 15C26.25 15.1875 26.25 15.5625 26.0625 15.75Z"
                            // fill="white"
                          />
                          <path
                            d="M30 54.375C25.875 54.375 22.5 51 22.5 46.875C22.5 42.75 25.875 39.375 30 39.375C34.125 39.375 37.5 42.75 37.5 46.875C37.5 51 34.125 54.375 30 54.375Z"
                            // fill="white"
                          />
                        </svg>
                      </div>

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
                        <FeatherIcon className="arrow_icon" icon="chevron-right" />
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
                      <div className="icon_div">
                        {/* <FaUserTie /> */}
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_10055_1130)">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M35.697 5.3806C34.7712 5 33.5975 5 31.25 5C28.9025 5 27.7287 5 26.803 5.3806C25.5685 5.88808 24.5877 6.86145 24.0764 8.08658C23.843 8.64585 23.7516 9.29625 23.7159 10.245C23.6633 11.6392 22.9429 12.9297 21.7254 13.6273C20.5079 14.3249 19.0216 14.2988 17.7787 13.6469C16.9329 13.2032 16.3197 12.9566 15.715 12.8776C14.3902 12.7045 13.0504 13.0607 11.9904 13.868C11.1953 14.4735 10.6085 15.4822 9.43474 17.4998C8.26102 19.5174 7.67417 20.5262 7.54337 21.5123C7.36894 22.827 7.72794 24.1567 8.54137 25.2087C8.91264 25.689 9.43442 26.0925 10.2442 26.5975C11.4348 27.34 12.2008 28.6047 12.2007 30C12.2006 31.3953 11.4346 32.6597 10.2442 33.402C9.43429 33.9072 8.91242 34.311 8.54112 34.7913C7.72769 35.8433 7.36872 37.1728 7.54312 38.4875C7.67392 39.4735 8.26079 40.4825 9.43449 42.5C10.6082 44.5175 11.1951 45.5265 11.9901 46.1317C13.0502 46.939 14.39 47.2952 15.7147 47.1222C16.3194 47.0433 16.9326 46.7965 17.7783 46.353C19.0213 45.701 20.5077 45.675 21.7253 46.3725C22.9428 47.0702 23.6633 48.3607 23.7159 49.7552C23.7516 50.7038 23.843 51.3542 24.0764 51.9135C24.5877 53.1385 25.5685 54.112 26.803 54.6195C27.7287 55 28.9025 55 31.25 55C33.5975 55 34.7712 55 35.697 54.6195C36.9315 54.112 37.9122 53.1385 38.4235 51.9135C38.657 51.3542 38.7485 50.7038 38.7842 49.755C38.8367 48.3608 39.557 47.0702 40.7745 46.3725C41.992 45.6748 43.4785 45.701 44.7215 46.353C45.5672 46.7965 46.1802 47.043 46.785 47.122C48.1097 47.2952 49.4495 46.939 50.5095 46.1317C51.3047 45.5262 51.8915 44.5175 53.0652 42.4998C54.239 40.4823 54.8257 39.4735 54.9567 38.4875C55.131 37.1728 54.772 35.843 53.9587 34.791C53.5872 34.3107 53.0655 33.907 52.2555 33.402C51.0652 32.6597 50.2992 31.395 50.2992 29.9998C50.2992 28.6045 51.0652 27.3403 52.2555 26.598C53.0657 26.0928 53.5875 25.6892 53.959 25.2087C54.7722 24.1568 55.1312 22.8272 54.957 21.5124C54.826 20.5264 54.2392 19.5176 53.0655 17.5C51.8917 15.4824 51.305 14.4736 50.5097 13.8682C49.4497 13.0609 48.11 12.7046 46.7852 12.8777C46.1805 12.9567 45.5672 13.2034 44.7217 13.647C43.4787 14.299 41.9922 14.3251 40.7747 13.6274C39.5572 12.9298 38.8367 11.6392 38.784 10.2449C38.7482 9.2962 38.657 8.64583 38.4235 8.08658C37.9122 6.86145 36.9315 5.88808 35.697 5.3806ZM31.25 37.5C35.4237 37.5 38.807 34.1423 38.807 30C38.807 25.8577 35.4237 22.5 31.25 22.5C27.0762 22.5 23.6929 25.8577 23.6929 30C23.6929 34.1423 27.0762 37.5 31.25 37.5Z"
                              // fill="white"
                            />
                            <path
                              d="M1.375 22.9749C1.375 16.0989 6.94905 10.5249 13.825 10.5249C20.701 10.5249 26.275 16.0989 26.275 22.9749C26.275 29.8509 20.701 35.4249 13.825 35.4249C6.94905 35.4249 1.375 29.8509 1.375 22.9749Z"
                              // fill="white"
                              stroke="#9F9F9F"
                              strokeWidth="4"
                            />
                            <path
                              d="M-2 45.6832C-2 40.6944 2.04862 36.6499 7.04286 36.6499H20.6071C25.6013 36.6499 29.65 40.6944 29.65 45.6832V54.7166C29.65 55.9638 28.6379 56.9749 27.3893 56.9749H0.260714C-0.987842 56.9749 -2 55.9638 -2 54.7166V45.6832Z"
                              // fill="white"
                              stroke="#9F9F9F"
                              strokeWidth="4"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_10055_1130">
                              <rect
                                width="60"
                                height="60"
                                fill="white"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

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
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Admins")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("roles") ? (
                      <li>
                        <Link to="/roles">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Roles")}</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("return-policy") ? (
              <li className="mt-3 li-sideBar">
                <Link
                  to="/return-policy"
                  className=""
                >
                  <div className="icon_div">
                    <RiRefund2Fill />
                    {/* <svg
                    width="60"
                    height="66"
                    viewBox="0 0 60 66"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M41.6011 26.7024L30.7205 33.0045C30.2825 33.2588 29.7315 33.2588 29.2792 33.0045L18.3989 26.7024C17.6217 26.2501 17.4239 25.1904 18.0173 24.5262C18.4271 24.0599 18.8934 23.6784 19.388 23.4099L27.0467 19.1708C28.6857 18.2523 31.3424 18.2523 32.9814 19.1708L40.64 23.4099C41.1347 23.6784 41.6011 24.074 42.0109 24.5262C42.576 25.1904 42.3782 26.2501 41.6011 26.7024Z"
                      // fill="white"
                    />
                    <path
                      d="M29.1944 35.6325V45.2695C29.1944 46.3435 28.1066 47.0499 27.1456 46.5838C24.2348 45.1566 19.3315 42.4858 19.3315 42.4858C17.6076 41.5109 16.1946 39.0522 16.1946 37.0315V29.7402C16.1946 28.6239 17.3674 27.9173 18.3283 28.4685L28.488 34.3607C28.9119 34.6294 29.1944 35.1097 29.1944 35.6325Z"
                      // fill="white"
                    />
                    <path
                      d="M30.8053 35.6325V45.2695C30.8053 46.3435 31.8934 47.0499 32.8544 46.5838C35.7652 45.1566 40.6685 42.4858 40.6685 42.4858C42.3923 41.5109 43.8055 39.0522 43.8055 37.0315V29.7402C43.8055 28.6239 42.6326 27.9173 41.6718 28.4685L31.512 34.3607C31.0881 34.6294 30.8053 35.1097 30.8053 35.6325Z"
                      // fill="white"
                    />
                    <path
                      d="M3.34346 38.5164C1.97974 32.963 2.52398 27.1336 4.89444 21.9034C7.2649 16.6732 11.3336 12.3246 16.4896 9.51065C21.6457 6.69672 27.6107 5.56932 33.4888 6.29778C39.367 7.02623 44.8411 9.57119 49.0891 13.5505"
                      // stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M56.7741 26.814C57.1852 28.656 57.3921 30.535 57.3913 32.4193C57.402 37.5957 55.8295 42.6607 52.8697 46.9823C49.9099 51.3039 45.6939 54.6902 40.7479 56.7193C35.8018 58.7483 30.3446 59.3301 25.0573 58.392C19.7701 57.4536 14.8869 55.0369 11.017 51.4437"
                      // stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M23.3231 50.2771L10.6438 51.174L11.6334 62.6087"
                      // stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M37.0854 14.9402L49.753 14.0433L48.7635 2.60852"
                      // stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg> */}
                  </div>

                  <span>{props.t("Return Policy")}</span>
                </Link>
              </li>
            ) : null}
            {adminType === "SUPER_ADMIN" || adminRoles?.includes("admins") || adminRoles?.includes("warranty") ? (
              <li className="mt-3  li-sideBar">
                <Link
                  to="/warranty"
                  onClick={(e) => handleItemClick("/warranty", e)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="icon_div">
                        <FeatherIcon icon="shield" />
                        {/* <svg
                          width="63"
                          height="60"
                          viewBox="0 0 63 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="59"
                            height="59"
                            stroke="#A5A5A5"
                          />
                          <path
                            d="M50.525 19.55L31.275 30.7C30.5 31.15 29.525 31.15 28.725 30.7L9.47505 19.55C8.10005 18.75 7.75005 16.875 8.80005 15.7C9.52505 14.875 10.35 14.2 11.225 13.725L24.775 6.22498C27.675 4.59998 32.375 4.59998 35.275 6.22498L48.8251 13.725C49.7001 14.2 50.5251 14.9 51.2501 15.7C52.2501 16.875 51.9 18.75 50.525 19.55Z"
                            // fill="white"
                          />
                          <path
                            d="M28.575 35.3499V52.3999C28.575 54.2999 26.65 55.5499 24.95 54.7249C19.8 52.1999 11.125 47.4749 11.125 47.4749C8.07495 45.7499 5.57495 41.3999 5.57495 37.8249V24.9249C5.57495 22.9499 7.64995 21.6999 9.34995 22.6749L27.325 33.0999C28.075 33.5749 28.575 34.4249 28.575 35.3499Z"
                            // fill="white"
                          />
                          <path
                            d="M31.425 35.3499V52.3999C31.425 54.2999 33.3501 55.5499 35.0501 54.7249C40.2001 52.1999 48.875 47.4749 48.875 47.4749C51.925 45.7499 54.4251 41.3999 54.4251 37.8249V24.9249C54.4251 22.9499 52.3501 21.6999 50.6501 22.6749L32.675 33.0999C31.925 33.5749 31.425 34.4249 31.425 35.3499Z"
                            // fill="white"
                          />
                          <path
                            d="M47.1688 27.7614L47.0016 27.7387L46.8343 27.761C45.5457 27.9334 44.3458 28.5114 43.4072 29.4107C43.0229 29.7334 42.6008 30.0077 42.1502 30.2275C41.6355 30.4044 41.1032 30.5249 40.5626 30.587C39.309 30.6406 38.1009 31.0737 37.0978 31.8295L36.9786 31.9192L36.884 32.0344C36.0613 33.0361 35.5952 34.283 35.558 35.5781C35.5072 36.107 35.3943 36.6279 35.2215 37.13C35.002 37.5827 34.7279 38.0066 34.4054 38.3923C33.5084 39.333 32.9326 40.5349 32.7609 41.8246L32.739 41.9895L32.7609 42.1544C32.9326 43.4442 33.5084 44.6461 34.4054 45.5868C34.7276 45.9722 35.0015 46.3957 35.2209 46.8479C35.3978 47.3648 35.5182 47.8995 35.5802 48.4425C35.635 49.6916 36.06 50.8966 36.8019 51.9033L36.8944 52.0288L37.0149 52.1277C38.0177 52.9513 39.2647 53.4184 40.5605 53.4561C41.085 53.5077 41.6018 53.62 42.1006 53.7907C42.5544 54.0196 42.9821 54.2976 43.3758 54.6197C44.3315 55.5183 45.55 56.0871 46.853 56.2413L47.0095 56.2599L47.1657 56.239C48.4514 56.067 49.6487 55.4913 50.5863 54.5956C50.979 54.2749 51.4052 53.998 51.8575 53.7699C52.3693 53.5946 52.8984 53.475 53.4358 53.4132C54.6872 53.363 55.8945 52.9344 56.8986 52.1838L57.0203 52.0927L57.1167 51.9752C57.9404 50.9706 58.4063 49.7204 58.442 48.4222C58.4939 47.8931 58.607 47.3718 58.779 46.869C58.9984 46.4167 59.2723 45.9931 59.5946 45.6077C60.4916 44.667 61.0674 43.4651 61.2391 42.1754L61.261 42.0105L61.2391 41.8456C61.0674 40.5558 60.4916 39.3539 59.5946 38.4132C59.2724 38.0278 58.9985 37.6043 58.7791 37.1521C58.6023 36.6354 58.4819 36.101 58.4199 35.5583C58.3669 34.3101 57.9405 33.1061 57.1951 32.1031L57.1033 31.9797L56.9844 31.8821C55.9814 31.0597 54.7351 30.593 53.4399 30.5544C52.9088 30.5022 52.3855 30.3877 51.8809 30.2134C51.4037 29.9924 50.9566 29.7107 50.5508 29.3752L50.5016 29.3346C49.579 28.4814 48.4159 27.9314 47.1688 27.7614ZM45.872 45.3584L45.872 45.3583L45.8699 45.3607C45.8632 45.3594 45.8566 45.3573 45.8502 45.3545C45.8388 45.3495 45.8283 45.3422 45.8194 45.3328L45.8083 45.3211L45.7968 45.3096L43.0094 42.5245L43.0776 42.46L44.9699 44.3913L45.8937 45.3342L45.872 45.3584ZM51.4626 39.1371L47.3365 43.7287L51.3967 39.0748L51.4626 39.1371Z"
                            // fill="white"
                            stroke="#A5A5A5"
                            strokeWidth="2.5"
                          />
                        </svg> */}
                      </div>
                      <span>{props.t("Warranty")}</span>
                    </div>
                    <div
                      className="arrow-down"
                      style={{ position: "absolute", top: "30px", right: "25px" }}
                    ></div>
                  </div>
                </Link>
                {openMenus.includes("/warranty") && (
                  <ul className={`sub-menu ${openMenus.includes("/warranty") ? "mm-show" : ""}`}>
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("warranty-policies") ? (
                      <li>
                        <Link to="/warranty-policies">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>{props.t("Manage Policies")}</span>
                        </Link>
                      </li>
                    ) : null}
                    {adminType === "SUPER_ADMIN" || adminRoles?.includes("warranty-requests") ? (
                      <li>
                        <Link to="/warranty-claims">
                          <FeatherIcon className="arrow_icon" icon="chevron-right" /> <span>Claims&Requests</span>
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
                  <div className="icon_div">
                    <IoMdSettings />
                  </div>

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
