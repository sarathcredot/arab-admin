import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
const items = [
  { text: "Dashboard", link: `/` },
  { text: "Coupons", link: `/coupons` },
];

const GET_COUPON_DETAIL = gql`
  query GetOneCouponDetails($input: getOneCouponDetailsInput) {
    getOneCouponDetails(input: $input) {
      _id
      name
      code
      description
      discountType
      discountValue
      max_discount
      minOrderAmount
      usageLimit
      orderCount
      usagePerUserLimit
      startDate
      expiryDate
      isActive
      userDetailsArrya {
        _id
        firstName
      }
      productDetailsArrya {
        _id
        productName
      }
      categoriesDetailsArrya {
        _id
        categoryName
      }
      brandDeatailsArrya {
        _id
        brandName
      }
      usedUsers {
        _id
        firstName
        mobileNumber
        displayName
        usageCount
      }
    }
  }
`;

const CouponDetailPage = () => {
  const [searchParams] = useSearchParams();
  const couponID = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("1");

  const [coupon, setCoupon] = useState<any>(null);

  // get coupon detail query
  const {
    loading: couponLoading,
    data: couponDataResponse,
    refetch: couponRefetch,
  } = useQuery(GET_COUPON_DETAIL, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        _id: couponID,
      },
    },
    skip: !couponID,
  });
  console.log("COUPON = ", couponDataResponse);

  useEffect(() => {
    if (couponDataResponse && couponDataResponse?.getOneCouponDetails) {
      setCoupon(couponDataResponse?.getOneCouponDetails);
    }
  }, [couponDataResponse]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumb
          items={items}
          currentPage="Coupon Details"
        />
        <Nav
          tabs
          style={{ marginTop: "20px" }}
        >
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab("1")}
            >
              Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "2" ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab("2")}
            >
              2
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "3" ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab("3")}
            >
              Used Users
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {couponLoading ? (
              <Loader />
            ) : coupon ? (
              <div style={{ display: "flex", marginTop: "20px", gap: "20px" }}>
                <Card className="w-100">
                  <CardHeader
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "17px", fontWeight: "500" }}>Details</span>
                    {/* <CustomButton
                      name=""
                      icon="ic:baseline-delete"
                      //   onClick={editFormToggle}
                    /> */}
                  </CardHeader>
                  <CardBody style={{ background: "#fafafa" }}>
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ fontSize: "15px", marginLeft: "8px" }}>General</h5>
                      <Row style={{ margin: 5, background: "#fff", borderRadius: "5px", paddingTop: "8px" }}>
                        <Col>
                          <FormGroup>
                            <Label
                              for="name"
                              className="font-size-13"
                            >
                              Coupon Name
                            </Label>
                            <Input
                              type="text"
                              name="name"
                              value={coupon?.name}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label
                              for="code"
                              className="font-size-13"
                            >
                              Coupon Code
                            </Label>
                            <Input
                              type="text"
                              name="code"
                              value={coupon?.code}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label
                              for="description"
                              className="font-size-13"
                            >
                              Description
                            </Label>
                            <Input
                              type="textarea"
                              name="description"
                              value={coupon?.description}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ fontSize: "15px", marginLeft: "8px" }}>Discount</h5>
                      <Row
                        style={{
                          margin: 5,
                          flexWrap: "wrap",
                          background: "#fff",
                          borderRadius: "5px",
                          paddingTop: "8px",
                        }}
                      >
                        <Col>
                          <FormGroup>
                            <div>
                              <Label
                                for="discountType"
                                className="font-size-13"
                              >
                                Discount Type
                              </Label>
                              <Input
                                name="discountType"
                                type="text"
                                value={coupon?.discountType}
                                disabled
                                style={{ background: "#fafafa" }}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                        {coupon?.discountType === "PERCENTAGE" && (
                          <Col>
                            <FormGroup>
                              <Label
                                for="max_discount"
                                className="font-size-13"
                              >
                                Maximum Discount
                              </Label>
                              <Input
                                type="number"
                                name="max_discount"
                                value={coupon?.max_discount}
                                disabled
                                style={{ background: "#fafafa" }}
                              />
                            </FormGroup>
                          </Col>
                        )}
                        {coupon?.discountType !== "FREE_SHIPPING" && (
                          <Col>
                            <FormGroup>
                              <Label
                                for="discountValue"
                                className="font-size-13"
                              >
                                Discount Amount
                              </Label>
                              <Input
                                type="number"
                                name="discountValue"
                                value={coupon?.discountValue}
                                disabled
                                style={{ background: "#fafafa" }}
                              />
                            </FormGroup>
                          </Col>
                        )}
                        <Col>
                          <FormGroup>
                            <Label
                              for="minOrderAmount"
                              className="font-size-13"
                            >
                              Minimum Order Amount
                            </Label>
                            <Input
                              type="number"
                              name="minOrderAmount"
                              value={coupon?.minOrderAmount}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ fontSize: "15px", marginLeft: "8px" }}>Restriction</h5>
                      <Row style={{ margin: 5, background: "#fff", borderRadius: "5px", paddingTop: "8px" }}>
                        <Col>
                          <FormGroup>
                            <Label className="font-size-13">Selected Brands</Label>
                            <Select
                              isMulti
                              isLoading={couponLoading}
                              isDisabled
                              placeholder=""
                              value={coupon?.brandDeatailsArrya?.map((item: any) => ({
                                label: item?.brandName,
                                value: item?._id,
                              }))}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label className="font-size-13">Selected Categories</Label>
                            <Select
                              isMulti
                              isLoading={couponLoading}
                              isDisabled
                              placeholder=""
                              value={coupon?.categoriesDetailsArrya?.map((item: any) => ({
                                label: item?.categoryName,
                                value: item?._id,
                              }))}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label className="font-size-13">Selected Products</Label>
                            <Select
                              isMulti
                              isLoading={couponLoading}
                              placeholder=""
                              isDisabled
                              value={coupon?.productDetailsArrya?.map((item: any) => ({
                                label: item?.productName,
                                value: item?._id,
                              }))}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ fontSize: "15px", marginLeft: "8px" }}>Usage Limit</h5>
                      <Row style={{ margin: 5, background: "#fff", borderRadius: "5px", paddingTop: "8px" }}>
                        <Col md={12}>
                          <FormGroup>
                            <Input
                              type="checkbox"
                              name="private"
                              checked={coupon?.userDetailsArrya && coupon?.userDetailsArrya?.length > 0 ? true : false}
                            />
                            <Label
                              for="private"
                              className="font-size-13 ms-2"
                            >
                              Private
                            </Label>
                          </FormGroup>
                        </Col>
                        {/* <Col md={6}>
                          <FormGroup>
                            <Label className="font-size-13">Select Users</Label>
                          </FormGroup>
                        </Col> */}
                        <Col>
                          <FormGroup>
                            <Label
                              for="usageLimit"
                              className="font-size-13"
                            >
                              Total Coupons
                            </Label>
                            <Input
                              type="number"
                              name="usageLimit"
                              value={coupon?.usageLimit}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label
                              for="usagePerUserLimit"
                              className="font-size-13"
                            >
                              Per-User Limit
                            </Label>
                            <Input
                              type="number"
                              name="usagePerUserLimit"
                              value={coupon?.usagePerUserLimit}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label
                              for="orderCount"
                              className="font-size-13"
                            >
                              Order Number
                            </Label>
                            <Input
                              type="text"
                              name="orderCount"
                              value={coupon?.orderCount > 0 ? coupon?.orderCount : ""}
                              disabled
                              style={{ background: "#fafafa" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ marginBottom: "20px" }}></div>
                    <h5 style={{ fontSize: "15px", marginLeft: "8px" }}>Validity Period</h5>
                    <Row style={{ margin: 5, background: "#fff", borderRadius: "5px", paddingTop: "8px" }}>
                      <Col>
                        <FormGroup>
                          <Label
                            for="startDate"
                            className="font-size-13"
                          >
                            Start Date
                          </Label>
                          <Input
                            type="text"
                            name="startDate"
                            value={new Date(parseInt(coupon?.startDate))
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")}
                            disabled
                            style={{ background: "#fafafa" }}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label
                            for="expiryDate"
                            className="font-size-13"
                          >
                            Expiry Date
                          </Label>
                          <Input
                            type="text"
                            name="expiryDate"
                            value={new Date(parseInt(coupon?.expiryDate))
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")}
                            disabled
                            style={{ background: "#fafafa" }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            ) : (
              <h1>No Details</h1>
            )}
          </TabPane>
          <TabPane tabId="3">
            <div style={{ display: "flex", marginTop: "20px", gap: "20px" }}>
              <Card className="w-100">
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-striped table-bordered"
                      >
                        <Thead>
                          <Tr>
                            <Th>#</Th>
                            <Th>Name</Th>
                            <Th>Phone Number</Th>
                            <Th>Usage Count</Th>
                            {/* <Th>Action</Th> */}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {coupon?.usedUsers?.map((user: any, index: any) => (
                            <Tr key={index}>
                              <td>{index + 1}</td>
                              <td>{user?.displayName}</td>
                              <td>{user?.mobileNumber}</td>
                              <td>{user?.usageCount}</td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                  {/* <Row>
                    <Col>
                      <div className="d-flex justify-content-end mt-0 ">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 0}
                            >
                              Previous
                            </button>
                          </li>

                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${currentPage === index ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(index)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}

                          {currentPage < totalPages - 1 && (
                            <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                              >
                                Next
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </Col>
                  </Row> */}
                </CardBody>
              </Card>
            </div>
          </TabPane>
        </TabContent>
      </Container>
    </div>
  );
};

export default CouponDetailPage;
