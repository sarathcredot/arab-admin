import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDropzone, FileWithPath } from "react-dropzone";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useFormState } from "react-hook-form";


import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import Breadcrumbs from "../../components/Common/Breadcrumb";

interface CmsSectionForm {
  pageName: string;
  sectionName: string;
  title: string;
  subTitle: string;
  description: string;
  buttons: { buttonText: string | null; redirectionURL: string | null }[];
  images: FileWithPath[];
}
interface CmsRecordData {
  _id: string;
  buttons: {
    buttonText: string;
    redirectionURL: string;
  }[];
  description: string;
  isBlocked: boolean;
  images: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  pageName: string;
  sectionName: string;
  subTitle: string;
  title: string;
}
interface AddCmsSectionProps {
  Edit?: boolean;
  editedcms?: CmsRecordData | undefined; // Add this line
  // ... other properties
}

const ADD_CMS_SECTION = gql`
  mutation AddCmsSection($input: AddCmsInput!, $images: [Upload]) {
    addCmsSection(input: $input, images: $images) {
      _id
    }
  }
`;
const UPDATE_CMS_SECTION = gql`
  mutation UpdateCmsRecord($input: UpdateCmsInput!, $images: [Upload]) {
    updateCmsRecord(input: $input, images: $images) {
      _id
    }
  }
`;

const AddCmsSection: React.FC<AddCmsSectionProps> = ({ Edit, editedcms }) => {



  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CmsSectionForm>({
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [buttons, setButtons] = useState<
    { buttonText: string | null; redirectionURL: string | null }[]
  >([{ buttonText: null, redirectionURL: null }]);
  useEffect(() => {
    if (Edit && editedcms) {
      console.log("Edited CMS Data:", editedcms);

      setValue("pageName", editedcms.pageName);
      setValue("sectionName", editedcms.sectionName);
      setValue("title", editedcms.title);
      setValue("subTitle", editedcms.subTitle);
      const updatedButtons = editedcms?.buttons?.map(button => ({
      buttonText: button.buttonText || null,
      redirectionURL: button.redirectionURL || null,
    }));
    setButtons(updatedButtons);
   
    const imageValues :any= editedcms?.images?.map((image, index) => ({
      fileURL: image.fileURL || null,
    }));
    
    setValue("images", imageValues);
    console.log("Form images field:", getValues("images"));
  }
  }, [Edit, editedcms, setValue]);

  const { dirtyFields } = useFormState({
    control, // Make sure to pass the control to useFormState
  });

  console.log(editedcms,"Edit========================>",Edit)
  console.log("editedbtn", editedcms?.buttons);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [addCmsSection] = useMutation(ADD_CMS_SECTION);
  const [updateCmsRecord] = useMutation(UPDATE_CMS_SECTION);
  const handleDeleteImage = (indexToDelete:any) => {
    const currentImages = getValues("images");
    const updatedImages = currentImages.filter((_, index) => index !== indexToDelete);
    setValue("images", updatedImages);
  };

  // ...

  const onSubmit: SubmitHandler<CmsSectionForm> = async (data) => {
    try {
      let mutation;
      let variables;

      if (Edit) {
        // For update operation
        mutation = updateCmsRecord;
        
        
        variables = {
          input: {
            _id: editedcms?._id,
            pageName: data.pageName,
            sectionName: data.sectionName,
            title: data.title,
            subTitle: data.subTitle,
            buttons: buttons?.map(({ buttonText, redirectionURL }) => ({
              buttonText: buttonText || null,
              redirectionURL: redirectionURL || null,
            })),

           

          },
        
          images: acceptedFiles,
        };
      } else {
        // For add operation
        mutation = addCmsSection;
        variables = {
          input: {
            pageName: data.pageName,
            sectionName: data.sectionName,
            title: data.title,
            subTitle: data.subTitle,
            buttons: buttons?.map(({ buttonText, redirectionURL }) => ({
              buttonText: buttonText || null,
              redirectionURL: redirectionURL || null,
            })),
          },
          images: acceptedFiles,
        };
      }

      const response = await mutation({
        variables,
      });

      toast.success(`CMS Section ${Edit ? "updated" : "added"} successfully!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error ${Edit ? "updating" : "adding"} CMS Section:`,
          error.message
        );
        toast.error(
          `Failed to ${Edit ? "update" : "add"} CMS Section: ${error.message}`
        );
      } else {
        console.error(
          `Error ${Edit ? "updating" : "adding"} CMS Section:`,
          error
        );
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Cms"
            breadcrumbItem={Edit ? "Edit Cms" : "Add cms"}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                      <Label for="pageName">Page Name:</Label>
                      <Controller
                        control={control}
                        name="pageName"
                        rules={{ required: "Page Name is required" }}
                        render={({ field }) => (
                          <>
                            <Input type="text" id="pageName" {...field} />
                            {errors.pageName && (
                              <p className="text-danger">
                                {errors.pageName.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>
                    {/* <FormGroup>
                      <Label for="sectionName">Section Name:</Label>
                      <Controller
                        control={control}
                        name="sectionName"
                        rules={{ required: "Section Name is required" }}
                        render={({ field }) => (
                          <>
                            <Input type="text" id="sectionName" {...field} />
                            {errors.sectionName && (
                              <p className="text-danger">
                                {errors.sectionName.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup> */}
                    <FormGroup>
                      <Label for="title">Title:</Label>
                      <Controller
                        control={control}
                        name="title"
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                          <>
                            <Input type="text" id="title" {...field} />
                            {errors.title && (
                              <p className="text-danger">
                                {errors.title.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="subTitle">SubTitle:</Label>
                      <Controller
                        control={control}
                        name="subTitle"
                        render={({ field }) => (
                          <Input type="text" id="subTitle" {...field} />
                        )}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="buttons">Buttons:</Label>
                      {buttons.map((button, index) => (
                        <div key={index}>
                          <Row style={{ marginBottom: "10px" }}>
                            <Col md={5}>
                              <Input
                                type="text"
                                placeholder="Button Text"
                                value={button.buttonText || ""}
                                onChange={(e) =>
                                  setButtons((prevButtons) => {
                                    const newButtons = [...prevButtons];
                                    newButtons[index].buttonText =
                                      e.target.value;
                                    return newButtons;
                                  })
                                }
                              />
                            </Col>
                            <Col md={5}>
                              <Input
                                type="text"
                                placeholder="Redirection URL"
                                value={button.redirectionURL || ""}
                                onChange={(e) =>
                                  setButtons((prevButtons) => {
                                    const newButtons = [...prevButtons];
                                    newButtons[index].redirectionURL =
                                      e.target.value;
                                    return newButtons;
                                  })
                                }
                              />
                            </Col>
                            <Col md={2}>
                              <Button
                                type="button"
                                color="danger"
                                onClick={() =>
                                  setButtons((prevButtons) =>
                                    prevButtons.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ))}
                      <Button
                        type="button"
                        style={{
                          backgroundColor: "black",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                        onClick={() =>
                          setButtons((prevButtons) => [
                            ...prevButtons,
                            { buttonText: null, redirectionURL: null }, // Set initial values to null
                          ])
                        }
                      >
                        Add Button
                      </Button>
                    </FormGroup>
                    <FormGroup>
                      <Label for="images">Images:</Label>
                      <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p>Drop the files here ...</p>
                        ) : (
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        )}
                      </div>
                      <ul>
                        {acceptedFiles?.map((file, index) => (
                          <li key={index}>
                            {file.name} - {file.size} bytes
                           
                          </li>
                        ))}
                      </ul>
 
     
                    </FormGroup>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        width: "150px",
                        height: "40px",
                        borderRadius: "10px",
                      }}
                    >
                    {Edit?"Edit CMS Section":"Add cms section"}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddCmsSection;
