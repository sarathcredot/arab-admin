  import { gql, useMutation } from '@apollo/client';
  import { Formik, useFormik } from 'formik';
  import React from 'react'
  import { ToastContainer, toast } from 'react-toastify';
  // import { Form } from 'react-router-dom';
  import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
  import { select } from 'redux-saga/effects';
import { GET_PRODUCT_COMMENTS } from 'src/helpers/url_helper';
  import { colorValidations } from 'src/validation/validation';
  import { CLIENT_RENEG_LIMIT } from 'tls';


  interface ColorType {
    _id: string;
    categoryIdPath: string;
    colorCode: string;
    colorName: string;
    isBlocked: boolean;
  }

  interface Props {
      isOpen: boolean;
      toggle: () => void; 
      SelectedCategory?:String 
      refetch: () => void;
      isEdit?:ColorType | null | undefined

    }



  function AddColor({isOpen,toggle,SelectedCategory,refetch,isEdit}:Props) {
  console.log(SelectedCategory)
    const POST_COLOR=gql`
  mutation AddColor($input: AddColorInput!) {
    addColor(input: $input) {
      _id
    }
  }
  `

  const PUT_COLOR=gql`mutation UpdateColor($input: updateColorInput!) {
    updateColor(input: $input) {
      message
    }
  }`
  console.log(isEdit,"edit color")


    const [addColor] = useMutation(POST_COLOR)
    const [updateColor] = useMutation(PUT_COLOR)




      
      const onsubmit= async (value:any,{resetForm}:any)=>{
        try {
            

            if (isEdit) {
              let variables: any = {
                input: {
                  _id: isEdit?._id,
                  colorCode: value?.colorcode,
                  
                }
              }
              const response = await updateColor({
                variables,
              });
      
              if (response) {
                toast.success("Successfully updated ColorCode");
                refetch();
                resetForm()
              
              
              }
              return toggle();
            }

            let variables: any = {
              input: {
                categoryId: SelectedCategory?SelectedCategory:null,
                colorCode: value?.colorcode,
                colorName: value?.name,  
              }
            }
            const response=await addColor({
              variables
            })
            console.log(response)
            toast.success("successfully added color")
            refetch()
            toggle()
            resetForm()
            
            
        } catch (error:any) {
          toast.error(error.message)
          console.log(error)
        }
      }

      const formik = useFormik({
        enableReinitialize: true,
          initialValues: {
            name: '',
            colorcode:isEdit ? isEdit.colorCode:'',
          },
          validationSchema:colorValidations,
          onSubmit: async (values,{resetForm}) => {
            await onsubmit(values,{resetForm}); 
          },
      
        });



    return (
      <>
      <ToastContainer/>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEdit?"Edit colorCode ":"Add color"}</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
          {!isEdit? (
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                name='name'
                placeholder="Enter Color name"
                value={formik.values?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger">{formik.errors.name}</div>
              )}
            </FormGroup>
           
           ):""}
<FormGroup>
<Label for="colorcode">color Code </Label>
<Input
  type="text"
  id="colorcode"
  name='colorcode'
  placeholder="Enter color code"
  value={formik.values?.colorcode}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
/>
{formik.touched.colorcode && formik.errors.colorcode && (
  <div className="text-danger">{formik.errors.colorcode}</div>
)}
</FormGroup>

           
            
            
            <ModalFooter>
              <Button style={{backgroundColor:"rgba(0, 0, 0, 1)"}} type="submit">
              {isEdit? "Edit" : "Add"}
              </Button>
              <Button style={{backgroundColor:"rgba(177, 35, 73, 1)"}} onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
      </>
    )
  }

  export default AddColor