import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import { gql, useQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../Kyc/kyc.module.css";

const GET_ATTRIBUTE = gql`
  query GetAttributesDetailsWithCategoryByAdmin($input: AttributesDetailsWithCategoryIdInput!) {
  getAttributesDetailsWithCategoryByAdmin(input: $input) {
    record {
      _id
      categoryName
      attributes {
        _id
        attributeType
        name
        description
        attributeValues {
          _id
          value
          colorCode
          priority
          isBlocked
        }
        isBlocked
      }
    }
    message
  }
}
`;
function Catattribute({ selectedCategoryData, onSelectChange, editedProduct }: any) {

  const catId = selectedCategoryData;

  const { loading, error, data } = useQuery(GET_ATTRIBUTE, {
    variables: { input: { categoryId: catId } },
  });
  console.log("data", data);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [attributeData, setAttributeData] = useState([]) as any;

  useEffect(() => {
    setAttributeData(
      data?.getAttributesDetailsWithCategoryByAdmin?.record?.attributes
    );
  }, [data]);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);


  const [attributeselectedValues, setattributeSelectedValues] = useState<
    string[]
  >([]);
  // useEffect(()=>{

  //   const existValue=editedProduct?.attributes.map((value:any)=>value.attributeValue)
  // console.log(existValue);

  //   setAttributeData(existValue || [])
  // },[editedProduct])
  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    attriIndex: number
  ) => {
    const newValue = event.target.value;


    console.log(newValue)


    const newSelectedValues = [...attributeselectedValues];
    newSelectedValues[attriIndex] = newValue;


    setattributeSelectedValues(newSelectedValues);
    onSelectChange(newSelectedValues);
  };

  return (
    <div>
      {attributeData &&
        attributeData?.map((attri: any, index: any) => {
          return (
            attri?.attributeValues?.length > 0 && (

              <div key={index} className="mt-3">
                <Label>{attri?.description}</Label>
                <Input
                  disabled={editedProduct}
                  style={{ borderRadius: "0px", backgroundColor: "white" }}
                  type="select"
                  onChange={(e: any) => handleSelectChange(e, index)}
                  defaultValue={editedProduct?.attributes[index]?.attributeValueId || "Select"}
                >
                  <option value="">Select</option>
                  {attri?.attributeValues.map(
                    (attributes: any, index: number) => (
                      <option key={index} value={attributes._id}>
                        {attributes.value}
                      </option>
                    )
                  )}
                </Input>
              </div>
            )
          );
        })}
    </div>
  );
}

export default Catattribute;
