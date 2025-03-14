import * as yup from "yup";

export const categoryValidation = yup.object().shape({
  name: yup.string().required("Category Name is required").min(3),
  description: yup.string().min(5, "Description must be at  5 characters"),
  image: yup.string().notRequired(),
});

export const colorValidations = yup.object().shape({
  name: yup.string().min(2, "color Name is required"),
  colorcode: yup.string().min(3, "Color must be at  3 characters"),
});

export const sizeValidations = yup.object().shape({
  size: yup.string().required("size is required").min(1),
});

export const vendoreValidation = yup.object({
  name: yup.string().required("Please enter a name"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup.string()
  .matches(/^\d{8}$/, "Phone number must be exactly 8 digits")
  .required("Phone number is required"),
  countryCode: yup.string().required("Country code is required"),
  image: yup.string(),
});

export const brandValidation = yup.object().shape({
  brandName: yup.string().required("Brand Name is required").min(3),
  image: yup.string().notRequired(),
  priority: yup.number().required("Priority is required").min(1),
});

export const AttributeValidation = yup.object().shape({
  attributeName: yup.string().required("Attribute Name is required").min(3),
  description: yup.string().required("description is required").min(3),
});

export const subAttributeVAlidation = yup.object().shape({
  attributeValue: yup.string().required("Attribute value is required").min(1),
  colorCode: yup.string().min(1, "color code required"),
  priority: yup.number().required("Priority is required").min(1),
});

export const vendorCompanyValidation = yup.object().shape({
  companyName: yup.string().required("Company name is required").nullable(),
  companyType: yup.string().required("Company type is required").nullable(),
  crNumber: yup.string().required("crNumber  is required").nullable(),
  status: yup.string().required("Status is required").nullable(),
  remarks: yup.string(),
});

export const vendorBusinessOutletValidation = yup.object().shape({
  outletName: yup.string().nullable(),
  country: yup.string().nullable(),
  district: yup.string().nullable(),
  village: yup.string().nullable(),
  address: yup.string().nullable(),
  contactPersonName: yup.string().nullable(),
  contactPersonNumber: yup.string().nullable(),
  contactPersonDesignation: yup.string().nullable(),
  status: yup.string().nullable(),
  remarks: yup.string().nullable(),
});

// delivery boy validation
export const DeliveryBoyValidation = yup.object({
  fullName: yup.string().required("Please enter a full name"),
  contactNumber: yup
    .string()
    .matches(/^\d{8}$/, "Phone number must be exactly 8 digits")
    .required("Phone number is required"),
  userID: yup.string().email("Invalid email address").required("Email is required"),
  agentType: yup.string().required("Agent Type is required"),
  governorate: yup.string().required("governorate is required"),
  village: yup.string().required("Wilayat is required"),
  password: yup.string().min(6, "password must be 6").required("Please Enter Your Password"),
});
export const EditDeliveryBoyValidation = yup.object({
  fullName: yup.string().required("Please enter a full name"),
  contactNumber: yup
    .string()
    .matches(/^\d{8}$/, "Phone number must be exactly 8 digits")
    .required("Phone number is required"),
  userID: yup.string().email("Invalid email address").required("Email is required"),
  agentType: yup.string().required("Agent Type is required"),
  governorate: yup.string().required("governorate is required"),
  village: yup.string().required("Wilayat is required"),
});

// settlement validation
export const SettlementValidation = yup.object({
  amount: yup
    .number()
    .typeError("Amount must be a number") // Ensures the value is a number
    .required("Please enter Amount") // Makes the field required
    .positive("Amount must be a positive number") // Validates positivity
    .test(
      "is-valid-amount",
      "Amount must be greater than zero",
      (value) => value > 0 // Custom validation logic
    ),
});

// coupon validation

export const CouponValidation = yup.object({
  name: yup.string().required("Please enter coupon name"),
  code: yup.string().required("Please enter coupon code"),
  description: yup.string().required("Please enter description"),
  discountType: yup.string().required("Please select discount type"),
  // discountValue: yup.string().required("Please enter discount amount"),
  minOrderAmount: yup.string().required("Please enter minimum order amount"),
  usageLimit: yup.string().required("Please enter total redemptions"),
  // usagePerUserLimit: yup.string().required("Please enter per user limit"),
  // orderCount: yup.string().required("Please enter nth order"),
  startDate: yup.string().required("Please enter start date"),
  // expiryDate: yup.string().required("Please enter coupon code"),
});

// admin validation

export const AdminValidation = yup.object({
  fullName: yup.string().required("Please enter admin name"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  accType: yup.string().required("Please select account type"),
  password: yup.string().required("Please enter password"),
  image: yup.mixed().required("Please select a profile image"),
});

export const EditAdminValidation = yup.object({
  fullName: yup.string().required("Please enter admin name"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  accType: yup.string().required("Please select account type"),
});
export const ReturnPolicyValidation = yup.object({
  name: yup.string().required("Please enter return policy name"),
  description: yup.string().required("Please enter return policy description"),
  // conditions: yup
  //   .array()
  //   .of(yup.string().required("Condition cannot be empty"))
  //   .min(1, "At least one condition is required"),
  duration: yup.string().required("Please enter return period"),
  returnCharge: yup.string().required("Please enter refund amound"),
});
export const WarrantyPolicyValidation = yup.object({
  name: yup.string().required("Please enter warranty policy name"),
  description: yup.string().required("Please enter warranty policy description"),
  duration: yup
    .number()
    .typeError("Warranty duration must be a number")
    .positive("Warranty duration must be a positive number")
    .required("Please enter warranty duration"),
  warrantyType: yup.array().min(1, "Please select at least one warranty type"), // Ensures at least one selection
});
