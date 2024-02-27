
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
