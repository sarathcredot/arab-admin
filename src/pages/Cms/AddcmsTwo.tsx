import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
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
} from "reactstrap";
import { gql } from "@apollo/client";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { flatMap } from "lodash";
import { useNavigate } from "react-router";

interface CmsSectionForm {
  pageName: string;
  subTitle: string;
  title: string;
  items: {
    buttonText: string | null;
    redirectionURL: string | null;
    subTitle: string | null;
    title: string | null;
    image: FileList | null;
  }[];
}
interface CmsTwoRecord {
  _id: string;
  pageName: string;
  sectionName: string;
  subTitle: string;
  title: string;
  items: {
    button: {
      buttonText: string;
      redirectionURL: string;
    };
    image: {
      fileType: string;
      fileURL: string;
      mimeType: string;
      originalName: string;
    };
    subTitle: string;
    title: string;
    _id: string;
  }[];
  isBlocked: string;
}
interface AddCmsTwoSectionProps {
  edit?: boolean;
  editedcmstwo?: CmsTwoRecord | undefined; // Add this line
}
const ADD_CMS_SECTION = gql`
  mutation AddCms2Section($input: Cms2AddInput!, $images: [Upload]) {
    addCms2Section(input: $input, images: $images) {
      _id
    }
  }
`;
const UPDATE_CMS_SECTION = gql`
  mutation Mutation($input: UpdateCms2Input!,$fileMap: JSONObject, $images: [Upload]) {
    updateCms2Record(input: $input, fileMap: $fileMap, images: $images) {
      message
      record {
        _id
        items {
          image {
            fileType
            fileURL
            mimeType
            originalName
          }
          button {
            buttonText
            redirectionURL
          }
          subTitle
          title
          
         
        }
      }
    }
  }
`;
const AddCmsTwoSection: React.FC<AddCmsTwoSectionProps> = ({
  edit,
  editedcmstwo,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CmsSectionForm>({
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });

  const [buttons, setButtons] = useState<
    {
      buttonText: string | null;
      redirectionURL: string | null;
      subTitle: string | null;
      title: string | null;
      image: FileList | null;
      _id: string | null;
    }[]
  >([
    {
      buttonText: null,
      redirectionURL: null,
      subTitle: null,
      title: null,
      image: null,
      _id: null
    },
  ]);

  const [addCmsSection] = useMutation(ADD_CMS_SECTION);
  const [updateCmsSection] = useMutation(UPDATE_CMS_SECTION);
  const [fileMap, setFileMap] = useState({});
  const [indexState, setIndexState] = useState<any>([]);


  useEffect(() => {
    if (edit && editedcmstwo) {
      // Populate form fields if editing
      setValue("pageName", editedcmstwo.pageName);
      setValue("subTitle", editedcmstwo.subTitle);
      setValue("title", editedcmstwo.title);

      const items = editedcmstwo.items.map((item) => ({
        buttonText: item.button.buttonText,
        redirectionURL: item.button.redirectionURL,
        subTitle: item.subTitle,
        title: item.title,
        image: null,
        _id: item._id
      }));

      console.log(items,"sdsfghjklhgfjk")

      setButtons(items);
      editedcmstwo.items.forEach((item, index) => {
        const imageUrl: any = item.image ? item.image.fileURL : null;
        setValue(`items.${index}.image`, imageUrl);
        console.log("imurl", imageUrl);
      });
    }
  }, [edit, editedcmstwo, setValue]);




 
const navigate=useNavigate()
  const onSubmit: SubmitHandler<CmsSectionForm> = async (data) => {
    try {
      if (edit && editedcmstwo) {
        const images = buttons.map((button) => {
          return button.image ? button.image[0] : null;
        });
       
        await updateCmsSection({
          variables: {
            input: {
              _id: editedcmstwo._id,
              items: buttons.map(
                ({ buttonText, redirectionURL, subTitle, title, _id }) => ({
                  button: { buttonText, redirectionURL },
                  subTitle,
                  title,
                  _id
                })
              ),
              pageName: data.pageName,
              subTitle: data.subTitle,
              title: data.title,
            },
            images: images.filter(Boolean), // Filter out null values
            fileMap: fileMap
          },
        });
        setIndexState([])
        toast.success("CMS Section updated successfully!");
        navigate("/cmstwolisting")
      } else {
        // Add new CMS section
        await addCmsSection({
          variables: {
            input: {
              items: buttons.map(
                ({ buttonText, redirectionURL, subTitle, title, image }) => ({
                  button: { buttonText, redirectionURL },
                  subTitle,
                  title,
                })
              ),
              pageName: data.pageName,
              subTitle: data.subTitle,
              title: data.title,
            },  
            images: buttons.map((button) => button.image?.[0]),

          },
        });
        toast.success("CMS Section added successfully!");
        navigate("/cmstwolisting")
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
        toast.error(`Failed: ${error.message}`);
      } else {
        console.log("Error:", error);
      }
    }
  };

 
  // const [fileMap, setFileMap] = useState<any>({});
  
  const hndleFileMap = (index: any, itemId: any) => {
    setIndexState((prevIndexState: any) => [...prevIndexState, index]);
    if (itemId) {
      setFileMap((prevFileMap: any) => {
        const updatedIndexState = [...indexState, index];
        console.log(updatedIndexState,"updatedIndexState")
        const lastIndex = updatedIndexState.length - 1;
        console.log(lastIndex,"lastIndex  ")
        return {
          ...prevFileMap,
          [itemId]: lastIndex,
        };
      });
    }
  };
  
  

   

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="CMS Section"
            breadcrumbItem={edit ? "Edit Cms section" : "Add CMS Section"}
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
                      <Label for="buttons">Items:</Label>
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
                              <Input
                                type="text"
                                placeholder="Title"
                                value={button.title || ""}
                                onChange={(e) =>
                                  setButtons((prevButtons) => {
                                    const newButtons = [...prevButtons];
                                    newButtons[index].title = e.target.value;
                                    return newButtons;
                                  })
                                }
                              
                              />
                            </Col>
                            <div
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                gap: "20px",
                              }}
                            >
                              <Col md={2}>
                                <Input
                                  type="text"
                                  placeholder="SubTitle"
                                  value={button.subTitle || ""}
                                  onChange={(e) =>
                                    setButtons((prevButtons) => {
                                      const newButtons = [...prevButtons];
                                      newButtons[index].subTitle =
                                        e.target.value;
                                      return newButtons;
                                    })
                                  }
                                />
                              </Col>
                              <Col md={4}>
                                <Input
                                  type="file"
                                  style={{ width: "400px" }}
                                  onChange={(e) =>
                                    setButtons((prevButtons) => {
                                      const newButtons = [...prevButtons];
                                      newButtons[index].image = e.target.files;
                                      hndleFileMap(index, button._id);
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
                            </div>
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
                            {
                              buttonText: null,
                              redirectionURL: null,
                              subTitle: null,
                              title: null,
                              image: null,
                              _id: null,
                            },
                          ])
                        }
                      >
                        Add Item
                      </Button>
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
                      {edit ? "Edit CMS Section" : "Add cms section"}
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

export default AddCmsTwoSection;
