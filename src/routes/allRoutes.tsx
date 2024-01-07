import React from "react";
import { Navigate } from "react-router-dom";

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
import UserProfile from "src/pages/Authentication/user-profile";
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
interface RouteProps {
  path: string;
  component: any;
  exact?: boolean;
}

const adminRoutes: Array<RouteProps> = [
  // //User Profile
  { path: "/profile", component: <UserProfile /> },

  // //dashboard
  { path: "/dashboard", component: <Dashboard /> },

  // //Calendar
  // { path: "/apps-calendar", component: <Calendar className="" /> },

  // //Chat
  // { path: "/apps-chat", component: <Chat /> },

  // //Email Inbox
  // { path: "/email-inbox", component: <Inbox /> },
  // { path: "/email-read", component: <EmailRead /> },

  // //Invoice
  // { path: "/invoices-list", component: <InvoiceList /> },
  // { path: "/invoices-detail", component: <InvoiceDetails /> },

  // //Contact
  // { path: "/contacts-grid", component: <ContactsGrid /> },
  // { path: "/contacts-list", component: <ContactsList /> },
  // { path: "/contacts-profile", component: <ContactsProfile /> },

  // //blog
  // { path: "/blog-grid", component: <BlogGrid /> },
  // { path: "/blog-list", component: <BlogList /> },
  // { path: "/blog-details", component: <BlogDetails /> },

  // //Utility
  // { path: "/pages-starter", component: <PageStarter /> },
  // { path: "/pages-timeline", component: <PageTimeline /> },
  // { path: "/pages-faqs", component: <PageFaqs /> },
  // { path: "/pages-pricing", component: <PagePricing /> },
  //Utility

  { path: "/product", component: <Productlisting/> },
  { path: "/product/details",component:<View/> },
  { path: "/add-product",component:<Addproduct/> },
  {path:"/add-variant",component:<AddVariant/>},
  {path:"/cmslisting",component:<CmsListing/>},
  {path:"/cmstwolisting",component:<CmstwoListing/>},
  { path: "/cms/details",component:<CmsRecordDetails/>},
  { path: "/cmstwo/details",component:<CmsTwoRecordDetails/>},
  { path: "/add-cms",component:<AddCmsSection/>},
  { path: "/add-cms2",component:<AddCmstwosection/>},







  

  


  


  // //UI Components
  // { path: "/ui-alerts", component: <UiAlert /> },
  // { path: "/ui-buttons", component: <UiButton /> },
  // { path: "/ui-cards", component: <UiCard /> },
  // { path: "/ui-carousel", component: <UiCarousel /> },
  // { path: "/ui-dropdowns", component: <UiDropdowns /> },
  // { path: "/ui-grid", component: <UiGrid /> },
  // { path: "/ui-modals", component: <UiModal /> },
  // { path: "/ui-images", component: <UiImages /> },
  // { path: "/ui-offcanvas", component: <UiOffCanvas /> },
  // { path: "/ui-progressbars", component: <UiProgressbar /> },
  // { path: "/ui-placeholders", component: <UiPlaceholders /> },
  // { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  // { path: "/ui-typography", component: <UiTypography /> },
  // { path: "/ui-toasts", component: <UiToast /> },
  // { path: "/ui-video", component: <UiVideo /> },
  // { path: "/ui-general", component: <UiGeneral /> },
  // { path: "/ui-colors", component: <UiColors /> },
  // { path: "/ui-utilities", component: <UiUtilities /> },

  // //Extended pages
  // { path: "/extended-lightbox", component: <UiLightbox /> },
  // { path: "/extended-rangeslider", component: <RangeSlider /> },
  // {
  //   path: "/extended-session-timeout",
  //   component: <SessionTimeout/>,
  // },
  // { path: "/extended-rating", component: <UiRating /> },
  // { path: "/extended-notifications", component: <Notifications /> },

  // // Forms pages
  // { path: "/form-elements", component: <FormElements /> },
  // { path: "/form-validation", component: <FormValidation /> },
  // { path: "/form-advanced", component: <AdvancedPlugins /> },
  // { path: "/form-editors", component: <FormEditors /> },
  // { path: "/form-uploads", component: <FormUpload /> },
  // { path: "/form-wizard", component: <FormWizard /> },
  // { path: "/form-mask", component: <FormMask /> },

  // //tables
  // { path: "/tables-basic", component: <BasicTable /> },
  // { path: "/tables-datatable", component: <DatatableTables /> },
  // { path: "/tables-responsive", component: <ResponsiveTables /> },
  // { path: "/tables-editable", component: <EditableTables /> },

  // //Charts
  // { path: "/charts-apex", component: <Apexchart /> },
  // { path: "/charts-echart", component: <EChart /> },
  // { path: "/charts-chartjs", component: <ChartjsChart /> },
  // { path: "/charts-sparkline", component: <SparklineChart /> },

  // //Icons
  // { path: "/icons-boxicons", component: <IconBoxicons /> },
  // { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  // { path: "/icons-dripicons", component: <IconDripicons /> },
  // { path: "/icons-fontawesome", component: <IconFontawesome /> },

  // //Maps
  // { path: "/maps-google", component: <MapsGoogle /> },
  // { path: "/maps-vector", component: <MapsVector /> },
  // { path: "/maps-leaflet", component: <MapsLeaflet /> },

  { path: "/category", component: <Category /> },
  {path: "/colors", component: <ColorList/>},
  {path: "/size", component: <SizeList/>},

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  {path: "/vendors", exact: true, component: <VendorList/>},
  { path: "/vendors/:id", exact: true, component: <ViewVenders /> },

  {path: "/kyc" , exact: true, component:<KycListing/>},
  {path: "/kyc/:id" , exact: true, component:<ViewKyc/>},
  {path: "/brands" , exact: true, component:<BrandList/>},
  {path: "/brands/:id" , exact: true, component:<ViewBrands/>}
];

const authRoutes: Array<RouteProps> = [
  //Authentication pages
  { path: "/login", component: <Login /> },
  // { path: "/logout", component: <Logout /> },
  // { path: "/register", component: <Register /> },
  // { path: "/recoverpw", component: <ForgetPassword /> },

  //AuthenticationInner pages
  // { path: "/page-login", component: <PageLogin /> },
  // { path: "/page-register", component: <PageRegister /> },
  // { path: "/page-recoverpw", component: <RecoverPassword /> },
  // { path: "/page-lock-screen", component: <LockScreen /> },
  // { path: "/page-confirm-mail", component: <ConfirmMail /> },
  // { path: "/page-email-verification", component: <EmailVerification /> },
  // { path: "/page-two-step-verification", component: <TwoStepVerfication /> },
  // { path: "/page-two-step-verification", component: <TwoStepVerfication /> },
  // { path: "/page-logout", component: <AuthLogout /> },

  //utility page
  // { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  // { path: "/pages-maintenance", component: <PageMaintenance /> },
  // { path: "/pages-404", component: <Error404 /> },
  // { path: "/pages-500", component: <Error500 /> },
];

export { adminRoutes, authRoutes };
