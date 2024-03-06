
import * as yup from "yup";

export const categoryValidation = yup.object().shape({
  name: yup.string().required('Category Name is required').min(3),
  description: yup.string().min(5, 'Description must be at  5 characters'),
  image: yup.string().notRequired()

});


export const colorValidations = yup.object().shape({
  name: yup.string().min(2, 'color Name is required'),
  colorcode: yup.string().min(3, 'Color must be at  3 characters'),
})


export const sizeValidations = yup.object().shape({
  size: yup.string().required('size is required').min(1),
})


export const vendoreValidation = yup.object({
  name: yup.string().required("Please enter a name"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  countryCode: yup.string().required("Country code is required"),
  image: yup.string(),
});



export const brandValidation = yup.object().shape({
  brandName: yup.string().required('Brand Name is required').min(3),
  image: yup.string().notRequired(),
  priority: yup.number().required("Priority is required").min(1)

});

export const AttributeValidation = yup.object().shape({
  attributeName: yup.string().required('Attribute Name is required').min(3),
  description: yup.string().required('description is required').min(3),
});


export const subAttributeVAlidation = yup.object().shape({
  attributeValue: yup.string().required('Attribute value is required').min(1),
  colorCode: yup.string().min(1, 'color code required'),
  priority: yup.number().required("Priority is required").min(1)
});

export const vendorCompanyValidation = yup.object().shape({
  companyName: yup.string().required('Company name is required').nullable(),
  companyType: yup.string().required('Company type is required').nullable(),
  crNumber: yup.string().required('crNumber  is required').nullable(),
  status: yup.string().required('Status is required').nullable(),
  remarks: yup.string()

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