import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSearchParams, useNavigate } from "react-router-dom";

import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.in";
import { Link } from "react-router-dom";
import { boolean } from "yup";
import AddProduct from "./addproduct";
import { ToastContainer, toast } from "react-toastify";
import { formatCurrency } from "src/utils/formatCurrency";
import Breadcrumb from "../../components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";

interface IAttribute {
  attributeId: string;
  attributeName: string;
  attributeValueId: string;
  attributeValue: string;
  attributeDescription: string;
}
interface ProductData {
  _id: string;
  vendorId: string;
  brandId: string;
  brandName: string;
  productName: string;
  shortDescription: string;
  warehouseSkuId: string;
  skuId: string;
  description: string;
  productInfo: string;
  productShortInfo: string;
  material: string;
  images: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  productDetailImages: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  rating: number;
  sellingPrice: number;
  price: number;
  mrp: number;
  tags: string[];
  productCode: string;
  categoryId: string;
  categoryNamePath: string;
  categoryIdPath: string;
  isBlocked: boolean;
  stock: number;
  status: string;
  offerPrice: number;
  attributes: IAttribute[];
}
interface IVariant {
  _id: string;
  color: string;
  size: string;
  stock: number;
  colorCode: string;
}

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const _id = searchParams.get("_id");
  const [product, setProduct] = useState<ProductData>();
  const [productVariants, setProductVariants] = useState<IVariant[]>([]);
  const [selectedVSize, setSelectedVSize] = useState<string>("");
  const [selectedVColor, setSelectedVColor] = useState<string>("");
  const [vColors, setVColors] = useState<{ name: string; colorCode: string }[]>([]);
  const [vSizes, setVSizes] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [editedProduct, setEditedProduct] = useState<ProductData | undefined>(undefined);

  const GET_PRODUCT = gql`
    query GetProductByAdmin($input: ProductId!) {
      getProductByAdmin(input: $input) {
        product {
          _id
          vendorId
          brandId
          brandName
          productName
          shortDescription
          skuId
          description
          productInfo
          productShortInfo
          images {
            fileType
            fileURL
            mimeType
            originalName
          }
          rating
          sellingPrice
          price
          mrp
          tags
          productCode
          categoryId
          categoryNamePath
          categoryIdPath
          isBlocked
          stock
          status
          offerPrice
          attributes {
            attributeId
            attributeName
            attributeValueId
            attributeValue
            attributeDescription
          }
          productDetailImages {
            fileType
            fileURL
            mimeType
            originalName
          }
          warehouseSkuId
        }
        message
      }
    }
  `;

  const GET_VARIANTS = gql`
    query Variants($input: VariantsInput!) {
      getVariants(input: $input) {
        variants {
          _id
          color
          size
          stock
          colorCode
        }
      }
    }
  `;

  const PUT_STATUS = gql`
    mutation UpdateProductByAdmin($input: UpdateProductByAdminInput!) {
      updateProductByAdmin(input: $input) {
        _id
        message
      }
    }
  `;

  const [UpdateProductStatus] = useMutation(PUT_STATUS);

  const {
    data: data,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        _id: _id,
      },
    },
    skip: !_id,
  });
  const {
    data: data2,
    loading: loading2,
    error: error2,
    refetch: refetch2,
  } = useQuery(GET_VARIANTS, {
    variables: {
      input: {
        _id: _id,
      },
    },
    skip: !_id,
  });

  // useEffect(() => {
  //   if (data && data.getProductByAdmin && data.getProductByAdmin.product) {
  //     let product: ProductData = data.getProductByAdmin.product;
  //     setProduct(product);
  //     setSelectedVSize(product.size);
  //     setSelectedVColor(product.color);
  //     setSelectedImage(product.images[0]?.fileURL || "");
  //   }
  // }, [data]);

  useEffect(() => {
    if (data && data.getProductByAdmin && data.getProductByAdmin.product) {
      let product: ProductData = data.getProductByAdmin.product;
      setProduct(product);
    }
  });

  useEffect(() => {
    if (data2 && data2.getVariants && data2.getVariants.variants) {
      let variants: IVariant[] = data2.getVariants.variants;
      setProductVariants(variants);

      let colors: { name: string; colorCode: string }[] = [];
      let sizes: string[] = [];

      variants.forEach((variant) => {
        if (colors.filter((item) => item.name === variant.color).length === 0) {
          colors.push({ colorCode: variant.colorCode, name: variant.color });
        }
        if (!sizes.includes(variant.size)) {
          sizes.push(variant.size);
        }
      });
      setVColors(colors);
      setVSizes(sizes);
    }
  }, [data2]);
  const handlecolorChange = (color: string) => {
    setSelectedVColor(color);
    setSelectedVSize("");
  };
  const handleImageClick = (imageURL: string | undefined) => {
    // Check if imageURL is defined, if not, provide a default value (empty string)
    setSelectedImage(imageURL || "");
  };

  const getProductVariant = (size: string): string => {
    for (let product of productVariants) {
      if (product.color == selectedVColor && product.size == size) {
        return product._id;
      }
    }
    return "";
  };

  const handleSizeChange = (size: string) => {
    setSelectedVSize(size);
    const id = getProductVariant(size);
    if (!id) {
      return;
    }

    if (navigate) {
      navigate(`/product/details/?_id=${id}`);
      // router.refresh()
    }
  };
  const isSizeOutOfStock = (size: string): boolean => {
    for (let product of productVariants) {
      if (product.color == selectedVColor && product.size == size && product.stock > 0) {
        return false;
      }
    }
    return true;
  };

  const [edit, setEdit] = useState(false);

  const handleEditProduct = () => {
    setEditedProduct(product);
    setEdit(true);
  };

  const handleStatusChange = async (status: any, e: any) => {
    e.preventDefault();
    try {
      let input: any = {
        _id: _id,
        status: status,
      };
      const response = await UpdateProductStatus({ variables: { input: input } });
      if (response) {
        console.log(response);
        toast.success(response.data.updateProductByAdmin.message);
        refetch();
      } else {
        console.log("Unexpected response format:", response);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Products", link: `/product` },
    { text: "Variants", link: `/product/variant?productCode=${product?.productCode}` },
  ];

  return (
    <React.Fragment>
      {edit ? (
        <AddProduct Edit={true} editedProduct={editedProduct} />
      ) : (
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb items={items} currentPage="View Product" />

            <div className="d-flex justify-content-between mb-3">
              <div style={{ width: "auto" }}>
                <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                  <p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Category : </p>
                  {product?.categoryNamePath}
                </p>
                <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                  <p style={{ margin: 0, fontWeight: 500, width: "100px" }}> W.Sku ID : </p>
                  {product?.warehouseSkuId}
                </p>
                <p style={{ margin: 0, fontWeight: 500, display: "flex" }}>
                  <p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Status : </p>
                  {product?.status}
                </p>
              </div>
              <CustomButton
                onClick={handleEditProduct}
                name="Edit Product"
                icon="ic:baseline-edit"
              />
            </div>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <form action="#">
                      <Row>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label htmlFor="cleave-time-format" className="form-label">
                              Images :
                            </label>

                            <div style={{ display: "flex", marginTop: "10px" }}>
                              {product?.images.map((item, index) => (
                                <div
                                  key={index}
                                  className="relative"
                                  style={{ marginRight: "10px" }}
                                >
                                  <img
                                    src={item?.fileURL}
                                    className="w-full rounded-2xl object-cover products-image"
                                    onClick={() => handleImageClick(item?.fileURL)}
                                    alt={`product detail ${index + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "contain",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <div className="border mt-3 border-dashed"></div>

                      <Row style={{ marginTop: "10px" }}>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label htmlFor="cleave-time-format" className="form-label">
                              Detail Images :
                            </label>

                            <div style={{ display: "flex", marginTop: "10px" }}>
                              {product?.productDetailImages.map((item, index) => (
                                <div
                                  key={index}
                                  className="relative"
                                  style={{ marginRight: "10px" }}
                                >
                                  <img
                                    src={item?.fileURL}
                                    className="w-full rounded-2xl object-cover products-image"
                                    onClick={() => handleImageClick(item?.fileURL)}
                                    alt={`product detail ${index + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "contain",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-3">
                        <Row>
                          <Col xl={6}>
                            <div className="" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-date" className="form-label">
                                Name:
                              </label>
                              <p className="form-control-static">{product?.productName}</p>
                            </div>
                          </Col>

                          <Col xl={3}>
                            <div
                              className=""
                              style={{ display: "flex", gap: "4px", alignItems: "center" }}
                            >
                              <label htmlFor="cleave-date" className="form-label">
                                Status :&nbsp;
                              </label>
                              <p className="form-control-static">
                                <StatusIndicator
                                  status={product?.isBlocked ? "BLOCKED" : "ACTIVE"}
                                  variant="chip"
                                />
                              </p>
                            </div>
                          </Col>
                          <Col xl={3}>
                            <div className="" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-date" className="form-label">
                                Stock :
                              </label>
                              <p className="form-control-static">{product?.stock}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label htmlFor="cleave-time-format" className="form-label">
                                Description:
                              </label>
                              <p className="form-control-static">{product?.description}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="border mt-3 border-dashed"></div>
                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label htmlFor="cleave-time-format" className="form-label">
                                {" "}
                                Short Description:
                              </label>
                              <p className="form-control-static">{product?.shortDescription}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            {product?.attributes.map((attribute, index) => (
                              <div key={index}>
                                <div className="mb-3" key={index}>
                                  <label htmlFor="cleave-time-format" className="form-label">
                                    {attribute.attributeDescription}
                                  </label>
                                  <p className="form-control-static">{attribute.attributeValue}</p>
                                </div>
                              </div>
                            ))}
                          </Col>
                        </Row>
                      </div>
                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={4}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-numeral" className="form-label">
                                {" "}
                                MRP :
                              </label>
                              <p className="form-control-static">{formatCurrency(product?.mrp)}</p>
                            </div>
                          </Col>

                          <Col xl={4}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-phone" className="form-label">
                                Price :
                              </label>
                              <p className="form-control-static">
                                {formatCurrency(product?.price)}
                              </p>
                            </div>
                          </Col>

                          <Col xl={4}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-numeral" className="form-label">
                                Selling Price :
                              </label>
                              <p className="form-control-static">
                                {formatCurrency(product?.sellingPrice)}
                              </p>
                            </div>
                          </Col>

                          <Col xl={6}>
                            <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                              <label htmlFor="cleave-numeral" className="form-label">
                                tags:
                              </label>
                              <p className="form-control-static">{product?.tags}</p>
                            </div>
                          </Col>

                          {product?.status === "APPROVED" ? (
                            <>{null}</>
                          ) : (
                            <>
                              <Col xl={6}>
                                <div className="mb-3" style={{ display: "flex", gap: "4px" }}>
                                  <CustomButton
                                    onClick={(e) => handleStatusChange("APPROVED", e)}
                                    name="Approve"
                                    icon="mdi:approve"
                                    bgColor="#e30613"
                                  />

                                  <CustomButton
                                    onClick={(e) => handleStatusChange("REJECTED", e)}
                                    name="Rejected"
                                    icon="material-symbols:close"
                                  />
                                </div>
                              </Col>
                            </>
                          )}
                        </Row>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProductDetails;
