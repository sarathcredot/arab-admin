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
  phone: yup.string().required("Phone number is required"),
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
  contactNumber: yup.string().required("Phone number is required"),
  userID: yup.string().email("Invalid email address").required("Email is required"),
  agentType: yup.string().required("Agent Type is required"),
  governorate: yup.string().required("governorate is required"),
  village: yup.string().required("village is required"),
  password: yup.string().min(6, "password must be 6").required("Please Enter Your Password"),
});
export const EditDeliveryBoyValidation = yup.object({
  fullName: yup.string().required("Please enter a full name"),
  contactNumber: yup.string().required("Phone number is required"),
  userID: yup.string().email("Invalid email address").required("Email is required"),
  agentType: yup.string().required("Agent Type is required"),
  governorate: yup.string().required("governorate is required"),
  village: yup.string().required("street is required"),
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
