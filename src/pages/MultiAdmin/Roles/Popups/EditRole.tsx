import React, { useEffect, useState } from "react";
//Import Icons
import FeatherIcon from "feather-icons-react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";

const EDIT_ROLE = gql`
  mutation UpdateRoleBySuperAdmin($input: updateRoleBySuperAdminInput!) {
    updateRoleBySuperAdmin(input: $input) {
      success
      message
    }
  }
`;

const GET_ROLE = gql`
  query GetRoleBySuperAdmin($input: getRoleBySuperAdminInput!) {
    getRoleBySuperAdmin(input: $input) {
      _id
      name
      description
      permissions
      isEnable
    }
  }
`;

const EditRole = ({ roleId, setRoleId, isOpen, toggle, refetch }: any) => {
  const [UpdateRole] = useMutation(EDIT_ROLE);
  const {
    data: roleData,
    error: roleError,
    loading: roleLoading,
    refetch: roleRefetch,
  } = useQuery(GET_ROLE, {
    variables: {
      input: {
        roleId,
      },
    },
    skip: !roleId,
    fetchPolicy: "network-only",
  });

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<any[]>([]);
  const [errors, setErrors] = useState({
    roleName: "",
    description: "",
    permissions: "",
  });

  const [delivery, setDelivery] = useState(false);
  const [categories, setCategories] = useState(false);
  const [orderResolution, setOrderResolution] = useState(false);

  const handlePermissions = (e: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      permissions: "",
    }));
    const { name, checked } = e.target;
    setPermissions((prev) => {
      let updatedPermissions = checked ? [...prev, name] : prev.filter((item) => item !== name);
      setParentItem(updatedPermissions);

      return updatedPermissions;
    });
  };

  const handleDelivery = (e: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      permissions: "",
    }));
    if (e.target.checked) {
      setDelivery(true);
      setPermissions((prev) => [...prev, "delivery-boys", "settlement"]);
    } else {
      setDelivery(false);
      setPermissions(permissions?.filter((item) => item !== "delivery-boys" && item !== "settlement"));
    }
  };
  const handleCategories = (e: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      permissions: "",
    }));
    if (e.target.checked) {
      setCategories(true);
      setPermissions((prev) => [...prev, "category", "assign-attribute"]);
    } else {
      setCategories(false);
      setPermissions(permissions?.filter((item) => item !== "category" && item !== "assign-attribute"));
    }
  };
  const handleOrderResolution = (e: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      permissions: "",
    }));
    if (e.target.checked) {
      setOrderResolution(true);
      setPermissions((prev) => [...prev, "orders", "shipping-orders", "return-orders", "refund-orders"]);
    } else {
      setOrderResolution(false);
      setPermissions(
        permissions?.filter(
          (item) =>
            item !== "orders" && item !== "shipping-orders" && item !== "return-orders" && item !== "refund-orders"
        )
      );
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roleName: "Please enter role name",
      }));
      return;
    } else if (!description.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Please enter description",
      }));
      return;
    } else if (!permissions.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        permissions: "Please select atleast one access for this role",
      }));
      return;
    }

    try {
      const response = await UpdateRole({
        variables: {
          input: {
            roleId,
            name: roleName,
            description,
            permissions,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response?.data?.updateRoleBySuperAdmin?.success) {
        console.log(response?.data?.updateRoleBySuperAdmin?.message);
        toast.success(response?.data?.updateRoleBySuperAdmin?.message);
        roleRefetch();
        refetch();
        setRoleId("");
        toggle();
        resetForm();
      } else {
        toast.error(response?.data?.updateRoleBySuperAdmin?.message);
      }
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
  };

  const resetForm = () => {
    setRoleName("");
    setDescription("");
    setPermissions([]);
    setDelivery(false);
    setCategories(false);
    setOrderResolution(false);
  };

  const setParentItem = (items: any) => {
    if (items.includes("delivery-boys") || items.includes("settlement")) {
      setDelivery(true);
    } else {
      setDelivery(false);
    }
    if (items.includes("category") || items.includes("assign-attribute")) {
      setCategories(true);
    } else {
      setCategories(false);
    }
    if (
      items.includes("orders") ||
      items.includes("shipping-orders") ||
      items.includes("return-orders") ||
      items.includes("refund-orders")
    ) {
      setOrderResolution(true);
    } else {
      setOrderResolution(false);
    }
  };

  useEffect(() => {
    if (roleData && roleData?.getRoleBySuperAdmin) {
      setRoleName(roleData?.getRoleBySuperAdmin?.name);
      setDescription(roleData?.getRoleBySuperAdmin?.description);
      setPermissions(roleData?.getRoleBySuperAdmin?.permissions);
      setParentItem(roleData?.getRoleBySuperAdmin?.permissions);
    }
  }, [roleData, roleId, isOpen, toggle,refetch]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="lg"
      >
        <ModalHeader toggle={toggle}>Add Role</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="roleName">Role Name</Label>
              <Input
                type="text"
                id="roleName"
                name="roleName"
                placeholder=" Enter Role Name"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    roleName: "",
                  }));
                }}
              />
              {errors.roleName && <div className="text-danger">{errors.roleName}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="remarks">Description</Label>
              <Input
                type="textarea"
                id="description"
                name="description"
                rows={2}
                placeholder=" Enter Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    description: "",
                  }));
                }}
              />
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </FormGroup>
            <Label>Access : </Label>
            <div className="mt-4 ">
              <Row className="mt-4">
                <Col md={4}>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="dashboard"
                      name="dashboard"
                      checked={permissions.includes("dashboard")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="dashboard"
                    >
                      Dashboard
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="users"
                      name="users"
                      checked={permissions.includes("users")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="users"
                    >
                      Users
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="vendors"
                      name="vendors"
                      checked={permissions.includes("vendors")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="vendors"
                    >
                      Vendors
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="delivery"
                      name="delivery"
                      checked={delivery}
                      onChange={(e) => handleDelivery(e)}
                    />
                    <Label
                      className="ms-2"
                      for="delivery"
                    >
                      Delivery{" "}
                      <span className="">
                        <FeatherIcon
                          style={{ width: "15px" }}
                          icon={delivery ? "chevron-down" : "chevron-right"}
                        />
                      </span>
                    </Label>
                  </FormGroup>
                  {delivery && (
                    <ul className="role_ul">
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="delivery-boys"
                            name="delivery-boys"
                            checked={permissions.includes("delivery-boys")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="delivery-boys"
                          >
                            Delivery Agents
                          </Label>
                        </FormGroup>
                      </li>
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="settlement"
                            name="settlement"
                            checked={permissions.includes("settlement")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="settlement"
                          >
                            Settlements
                          </Label>
                        </FormGroup>
                      </li>
                    </ul>
                  )}
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="kyc"
                      name="kyc"
                      checked={permissions.includes("kyc")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="kyc"
                    >
                      KYC
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="attributes"
                      name="attributes"
                      checked={permissions.includes("attributes")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="attributes"
                    >
                      Attributes
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="categories"
                      name="categories"
                      checked={categories}
                      onChange={(e) => handleCategories(e)}
                    />
                    <Label
                      className="ms-2"
                      for="categories"
                    >
                      Categories
                      <span className="">
                        <FeatherIcon
                          style={{ width: "15px" }}
                          icon={categories ? "chevron-down" : "chevron-right"}
                        />
                      </span>
                    </Label>
                  </FormGroup>
                  {categories && (
                    <ul className="role_ul">
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="category"
                            name="category"
                            checked={permissions.includes("category")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="category"
                          >
                            Category
                          </Label>
                        </FormGroup>
                      </li>
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="assign-attribute"
                            name="assign-attribute"
                            checked={permissions.includes("assign-attribute")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="assign-attribute"
                          >
                            Assign Attribute
                          </Label>
                        </FormGroup>
                      </li>
                    </ul>
                  )}
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="brands"
                      name="brands"
                      checked={permissions.includes("brands")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="brands"
                    >
                      Brands
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="product"
                      name="product"
                      checked={permissions.includes("product")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="product"
                    >
                      Products
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="coupons"
                      name="coupons"
                      checked={permissions.includes("coupons")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="coupons"
                    >
                      Coupons
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="order-resolution"
                      name="order-resolution"
                      checked={orderResolution}
                      onChange={(e) => handleOrderResolution(e)}
                    />
                    <Label
                      className="ms-2"
                      for="order-resolution"
                    >
                      Order Resolution
                      <span className="">
                        <FeatherIcon
                          style={{ width: "15px" }}
                          icon={orderResolution ? "chevron-down" : "chevron-right"}
                        />
                      </span>
                    </Label>
                  </FormGroup>
                  {orderResolution && (
                    <ul className="role_ul">
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="orders"
                            name="orders"
                            checked={permissions.includes("orders")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="orders"
                          >
                            All Orders
                          </Label>
                        </FormGroup>
                      </li>
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="shipping-orders"
                            name="shipping-orders"
                            checked={permissions.includes("shipping-orders")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="shipping-orders"
                          >
                            Shipping Orders
                          </Label>
                        </FormGroup>
                      </li>
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="return-orders"
                            name="return-orders"
                            checked={permissions.includes("return-orders")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="return-orders"
                          >
                            Return Orders
                          </Label>
                        </FormGroup>
                      </li>
                      <li>
                        <FormGroup>
                          <Input
                            type="checkbox"
                            id="refund-orders"
                            name="refund-orders"
                            checked={permissions.includes("refund-orders")}
                            onChange={(e) => handlePermissions(e)}
                          />
                          <Label
                            className="ms-2"
                            for="refund-orders"
                          >
                            Refund Orders
                          </Label>
                        </FormGroup>
                      </li>
                    </ul>
                  )}
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="cmslisting"
                      name="cmslisting"
                      checked={permissions.includes("cmslisting")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="cmslisting"
                    >
                      CMS
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="checkbox"
                      id="settings"
                      name="settings"
                      checked={permissions.includes("settings")}
                      onChange={(e) => handlePermissions(e)}
                    />
                    <Label
                      className="ms-2"
                      for="settings"
                    >
                      Settings
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <ModalFooter style={{ marginTop: "20px" }}>
              {errors.permissions && <div className="text-danger">{errors.permissions}</div>}
              <Button
                type="submit"
                color="primary"
              >
                Submit
              </Button>
              <Button
                color="secondary"
                onClick={toggle}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditRole;
