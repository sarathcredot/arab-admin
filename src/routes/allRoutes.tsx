import React from "react";
import { Navigate, Route } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard";

//Calendar
import Calendar from "src/pages/Calendar";

//Chat
import Chat from "src/pages/Chat/Chat";

//Email Inbox
import Inbox from "src/pages/Email/Inbox";
import EmailRead from "src/pages/Email/email-read";

//Invoice
import InvoiceList from "src/pages/Invoices/invoice-list";
import InvoiceDetails from "src/pages/Invoices/InvoiceDetails";

//Contacts
import ContactsGrid from "src/pages/Contacts/contactsGrid";
import ContactsList from "src/pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "src/pages/Contacts/ContactsProfile/contacts-profile";

//Utility
import PageStarter from "src/pages/Utility/PageStarter";
import PageMaintenance from "src/pages/Utility/PageMaintenance";
import PageTimeline from "src/pages/Utility/PageTimeline";
import PageFaqs from "src/pages/Utility/PageFAQs";
import PagePricing from "src/pages/Utility/PagePricing";
import Error404 from "src/pages/Utility/Error404";
import Error500 from "src/pages/Utility/Error500";

//UI Components
import UiAlert from "src/pages/UiComponents/UiAlert";
import UiButton from "src/pages/UiComponents/UiButton";
import UiCard from "src/pages/UiComponents/UiCard";
import UiCarousel from "src/pages/UiComponents/UiCarousel";
import UiDropdowns from "src/pages/UiComponents/UiDropdowns";
import UiGrid from "src/pages/UiComponents/UiGird";
import UiModal from "src/pages/UiComponents/UiModals";
import UiImages from "src/pages/UiComponents/UiImages";
import UiOffCanvas from "src/pages/UiComponents/UiOffCanvas";
import UiProgressbar from "src/pages/UiComponents/UiProgressbar";
import UiPlaceholders from "src/pages/UiComponents/UiPlaceholders";
import UiTabsAccordions from "src/pages/UiComponents/UiTabsAccordions";
import UiTypography from "src/pages/UiComponents/UiTypography";
import UiToast from "src/pages/UiComponents/UiToast";
import UiVideo from "src/pages/Utility/UiVideo";
import UiGeneral from "src/pages/UiComponents/UiGeneral";
import UiColors from "src/pages/UiComponents/UiColors";
import UiUtilities from "src/pages/UiComponents/Uiutilities";

//Extended pages
import UiLightbox from "src/pages/Extended/Lightbox";
import SessionTimeout from "src/pages/Extended/SessionTimeout";
import UiRating from "src/pages/Extended/UiRating";
import Notifications from "src/pages/Extended/Notifications";

//Forms pages
import FormElements from "src/pages/Forms/FormElements";
import FormValidation from "src/pages/Forms/FormValidation";
import AdvancedPlugins from "src/pages/Forms/AdvancedPlugins";
import FormEditors from "src/pages/Forms/FormEditors";
import FormUpload from "src/pages/Forms/FormUpload";
import FormWizard from "src/pages/Forms/FormWizard";
import FormMask from "src/pages/Forms/FormMask";

//Tables
import BasicTable from "src/pages/Tables/BasicTables";
import DatatableTables from "src/pages/Tables/DatatableTables";
import ResponsiveTables from "src/pages/Tables/ResponsiveTables";
import EditableTables from "src/pages/Tables/EditableTables";
import Productlisting from "src/pages/Product/listing";

//Charts
import Apexchart from "src/pages/Charts/Apexcharts";
import EChart from "src/pages/Charts/EChart";
import ChartjsChart from "src/pages/Charts/ChartjsChart";
import SparklineChart from "src/pages/Charts/SparklineChart";

//blog
import BlogGrid from "../pages/Blog/blogGrid";
import BlogList from "../pages/Blog/blogList";
import BlogDetails from "../pages/Blog/blogDetails";

//Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconFontawesome from "../pages/Icons/IconFontawesomes";

//AuthenticationInner pages
import PageLogin from "src/pages/AuthenticationInner/PageLogin";
import PageRegister from "src/pages/AuthenticationInner/PageRegister";
import RecoverPassword from "src/pages/AuthenticationInner/RecoverPassword";
import LockScreen from "src/pages/AuthenticationInner/LockScreen";
import ConfirmMail from "src/pages/AuthenticationInner/ConfirmMail";
import EmailVerification from "src/pages/AuthenticationInner/EmailVerification";
import TwoStepVerfication from "src/pages/AuthenticationInner/TwoStepVerfication";

//Authentication pages
import Login from "src/pages/Authentication/Login";
import Logout from "src/pages/Authentication/Logout";
import Register from "src/pages/Authentication/Register";
import ForgetPassword from "src/pages/Authentication/ForgetPassword";
import AdminProfile from "src/pages/Authentication/user-profile";
import PagesComingsoon from "src/pages/Utility/PageComingsoon";
import AuthLogout from "../pages/AuthenticationInner/Logout";

//Maps
import MapsGoogle from "src/pages/Maps/MapsGoogle";
import MapsVector from "src/pages/Maps/MapsVector";
import MapsLeaflet from "src/pages/Maps/MapsLeaflet";
import RangeSlider from "src/pages/Extended/RangeSlider/Index";
import Category from "src/pages/category/Category";
import ColorList from "src/pages/Color/ColorList";
import SizeList from "src/pages/Size/SizeList";
import View from "src/pages/Product/view";
import Addproduct from "src/pages/Product/addproduct";
import AddVariant from "src/pages/Product/addvariant";
import CmsListing from "src/pages/Cms/Cmsonelisting";
import CmstwoListing from "src/pages/Cms/Cmstwolisting";
import CmsRecordDetails from "src/pages/Cms/ViewCmsOnerecord";
import CmsTwoRecordDetails from "src/pages/Cms/ViewCmsTworecord";
import AddCmsSection from "src/pages/Cms/AddcmsSection";
import AddCmstwosection from "src/pages/Cms/AddcmsTwo";
import VendorList from "src/pages/venders/Venders";
import ViewVenders from "src/pages/venders/ViewVenders";
import KycListing from "src/pages/Kyc/KycListing";
import ViewKyc from "src/pages/Kyc/ViewKyc";
import BrandList from "src/pages/branding/BrandList";
import ViewBrands from "src/pages/branding/ViewBrand";
import AttributeList from "src/pages/Attributes/components/AttributeList";
import ValueAttributeList from "src/pages/Attributes/components/AttributeValue";
import Assignattribute from "src/pages/category/Assignattribute";
import VariantListing from "src/pages/Product/variantList";
import AssignBrands from "src/pages/branding/AssignBrands";
import UserList from "src/pages/User/UserList";
import AllOrders from "src/pages/Orders/allOrders/AllOrders";
import ALlOrderDetails from "src/pages/Orders/allOrders/AllOrderDetails";
import ShippingOrders from "src/pages/Orders/shippingOrders/ShippingOrders";
import ShippingOrderDetails from "src/pages/Orders/shippingOrders/ShippingOrderDetails";
import ReturnOrders from "src/pages/Orders/returnOrders/ReturnOrders";
import ReturnOrderDetails from "src/pages/Orders/returnOrders/ReturnOrderDetails";
import RefundOrders from "src/pages/Orders/refundOrders/RefundOrders";
import RefundOrderDetails from "src/pages/Orders/refundOrders/RefundOrderDetails";
import Settings from "src/pages/settings/Settings";
import UserProfile from "src/pages/User/UserProfile";
import VendorAnalyticsPage from "src/pages/venders/VendorAnalyticsPage";
import PageNotFound from "src/pages/Page404";
import DeliveryBoys from "src/pages/DeliveryAgents/DeliveryBoys";
import ViewDeliveryBoys from "src/pages/DeliveryAgents/ViewDeliveryBoys";
import SettlementPage from "src/pages/Settlements/SettlementPage";
import Coupons from "src/pages/Coupons";
import CouponDetailPage from "src/pages/Coupons/CouponDetailPage";
import Roles from "src/pages/MultiAdmin/Roles/Roles";
import Admins from "src/pages/MultiAdmin/Admins/Admins";
interface RouteProps {
  path: string;
  component: any;
  exact?: boolean;
}

const adminRoutes: Array<RouteProps> = [


  { path: "/100", component: <UiTabsAccordions /> },
  { path: "/1", component: <Inbox /> },
  { path: "/2", component: <EmailRead /> },
  { path: "/3", component: <InvoiceList /> },
  { path: "/4", component: <InvoiceDetails /> },
  { path: "/5", component: <ContactsGrid /> },
  { path: "/6", component: <ContactsList /> },
  { path: "/7", component: <ContactsProfile /> },
  { path: "/8", component: <PageStarter /> },
  { path: "/9", component: <PageMaintenance /> },
  { path: "/10", component: <PageTimeline /> }, // this was track the timlines for updations
  { path: "/11", component: <PageFaqs /> },
  { path: "/12", component: <PagePricing /> },
  { path: "/13", component: <Error404 /> },
  { path: "/14", component: <Error500 /> },
  { path: "/15", component: <UiAlert /> },
  { path: "/16", component: <UiButton /> },
  { path: "/17", component: <UiModal /> },
  { path: "/18", component: <UiImages /> },
  { path: "/19", component: <UiOffCanvas/> },
  { path: "/20", component: <UiPlaceholders/> },
  { path: "/21", component: <UiColors/> },
  { path: "/22", component: <Notifications/> },
  { path: "/23", component: <IconDripicons/> },
  { path: "/24", component: <IconFontawesome/> },
  { path: "/25", component: <UiToast/> },








  //User Profile
  { path: "/profile", component: <AdminProfile /> },

  //dashboard
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "/register", exact: true, component: <Register /> },
  { path: "/dashboard", component: <Dashboard /> },

 
    { path: "/product", component: <Productlisting /> },

  

  { path: "/product/details", component: <View /> },
  { path: "/product/variant", component: <VariantListing /> },
  { path: "/add-product", component: <Addproduct /> },
  { path: "/add-variant", component: <AddVariant /> },
  { path: "/cmslisting", component: <CmsListing /> },
  { path: "/cmstwolisting", component: <CmstwoListing /> },
  { path: "/cmslisting/details", component: <CmsRecordDetails /> },
  { path: "/cmstwo/details", component: <CmsTwoRecordDetails /> },
  { path: "/add-cms", component: <AddCmsSection /> },
  { path: "/add-cms2", component: <AddCmstwosection /> },


  { path: "/category", component: <Category /> },
  { path: "/assign-attribute", component: <Assignattribute /> },
  { path: "/colors", component: <ColorList /> },
  { path: "/size", component: <SizeList /> },


  { path: "/vendors", exact: true, component: <VendorList /> },
  { path: "/vendors/view", exact: true, component: <ViewVenders /> },
  { path: "/vendors/view/analytics", exact: true, component: <VendorAnalyticsPage /> },
  
  // Delivery
  { path: "/delivery-boys", exact: true, component: <DeliveryBoys /> },
  { path: "/delivery-boys/view", exact: true, component: <ViewDeliveryBoys /> },
  { path: "/settlement", exact: true, component: <SettlementPage /> },


  { path: "/kyc", exact: true, component: <KycListing /> },
  { path: "/kyc/:id", exact: true, component: <ViewKyc /> },
  { path: "/brands", exact: true, component: <BrandList /> },
  { path: "/brands/:id", exact: true, component: <ViewBrands /> },
  { path: "/assign-brands", component: <AssignBrands /> },

  { path: "/attributes", exact: true, component: <AttributeList /> },
  { path: "/attributes/:id", exact: true, component: <ValueAttributeList /> },
  { path: "/users", exact: true, component: <UserList /> },
  { path: "/user/view", component: <UserProfile /> },
  { path: "/style", component: <UiGeneral /> },
  { path: "/style1", component: <FormElements /> },
  { path: "/style2", component: <UiOffCanvas /> },

  // ORDERS
  { path: "/orders", component: <AllOrders /> },
  { path: "/orders/details", component: <ALlOrderDetails /> },

  { path: "/shipping-orders", component: <ShippingOrders /> },
  { path: "/shipping-orders/details", component: <ShippingOrderDetails /> },

  { path: "/return-orders", component: <ReturnOrders /> },
  { path: "/return-orders/details", component: <ReturnOrderDetails /> },

  { path: "/refund-orders", component: <RefundOrders /> },
  { path: "/refund-orders/details", component: <RefundOrderDetails /> },

  { path: "/settings", component: <Settings /> },
  
  // COUPONS

  { path: "/coupons", component: <Coupons /> },
  { path: "/coupons/detail", component: <CouponDetailPage /> },
  
  // Admin Management

  { path: "/admins", component: <Admins /> },
  { path: "/roles", component: <Roles /> },

  { path: "*", component: <PageNotFound /> },
];

const authRoutes: Array<RouteProps> = [

  { path: "/login", component: <Login /> },
  { path: "*", component: <Navigate to="/login" /> },
];


export { adminRoutes, authRoutes };
