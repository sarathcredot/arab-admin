
import * as yup from "yup";

export const categoryValidation = yup.object().shape({
    name: yup.string().required('Category Name is required').min(3),
    description: yup.string().min(5, 'Description must be at  5 characters'),
    image: yup.string().notRequired()

  });


  export const colorValidations =yup.object().shape({
    name: yup.string().min(2,'color Name is required'),
    colorcode: yup.string().min(3, 'Color must be at  3 characters'),
  })
  

  export const sizeValidations = yup.object().shape({
    size:yup.string().required('size is required').min(1),
  })  

  