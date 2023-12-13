import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';

import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { sizeValidations } from 'src/validation/validation';

interface Props {
    isOpen: boolean;
    toggle: () => void;
    SelectedCategory?:string
    refetch:()=>void;
  }


function SizeAdd({isOpen,toggle, SelectedCategory,refetch}:Props) {

  const ADD_SIZE=gql`
mutation Mutation($input: AddSizeInput!) {
  addSize(input: $input) {
    _id
  }
}`




const [addSize]=useMutation(ADD_SIZE)
  const onsubmit= async (value:any ,{resetForm}:any)=>{
    try {
        let variables: any = {
          input: {
            categoryId: SelectedCategory?SelectedCategory:null,
            size: value?.size,
            
           }
        }
        const response=await addSize({
          variables
        })
        console.log(response)
       
        toast.success("successfully added size")
        refetch()
        toggle()
        resetForm()
        // window.location.reload()
    } catch (error:any) {
      console.log(error)
      toast.error(error.message)
    }
  }
    const formik = useFormik({
        initialValues: {
          size: '', 
        },
        validationSchema:sizeValidations,
        onSubmit: async (values ,{ resetForm }) => {
          await onsubmit(values, { resetForm }); 
        },
        enableReinitialize: true,
      });

      
  return (
    <>
    <ToastContainer/>
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Size</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Label for="name">Size</Label>
            <Input
              type="text"
              id="size"
              name='size'
              placeholder="Enter size"
              value={formik.values?.size}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.size && formik.errors.size && (
              <div className="text-danger">{formik.errors.size}</div>
            )}
          </FormGroup>
          
          
          <ModalFooter>
            <Button style={{backgroundColor:"rgba(0, 0, 0, 1)"}} type="submit">
              Add
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

export default SizeAdd