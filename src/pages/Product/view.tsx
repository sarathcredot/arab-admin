import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { useSearchParams, useNavigate } from "react-router-dom";

import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.in";
import { Link } from "react-router-dom";
import { boolean } from "yup";
import AddProduct from "./addproduct";

interface ProductData {
  _id: string;
  color: string;
  size: string;
  description: string;
  material: string;
  shortDescription: string;
  images: {
    fileURL: string;
  }[];
  mrp: number;
  productCode: string;
  productName: string;
  rating: number;
  sellingPrice: number;
  price: number;
  skuId:number;
  tags: string;
  stock: string;
  categoryNamePath: string;
  categoryId: string;
  isBlocked:boolean;
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
  const [vColors, setVColors] = useState<{ name: string; colorCode: string }[]>(
    []
  );
  const [vSizes, setVSizes] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [editedProduct, setEditedProduct] = useState<ProductData | undefined>(
    undefined
  );

  const GET_PRODUCT = gql`
    query GetVariants($input: ProductId!) {
      getProductByAdmin(input: $input) {
        product {
          _id
          categoryId
          categoryIdPath
          categoryNamePath
          color
          images {
            fileType
            fileURL
            mimeType
            originalName
          }
          description
          isBlocked
          material
          mrp
          price
          productCode
          productName
          rating
          sellingPrice
          shortDescription
          size
          skuId
          stock
          tags
        }
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

  const {
    data: data,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery(GET_PRODUCT, {
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
  console.log("data------------", data);

  useEffect(() => {
    if (data && data.getProductByAdmin && data.getProductByAdmin.product) {
      let product: ProductData = data.getProductByAdmin.product;
      setProduct(product);
      setSelectedVSize(product.size);
      setSelectedVColor(product.color);
      setSelectedImage(product.images[0]?.fileURL || "");
    }
  }, [data]);

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
      if (
        product.color == selectedVColor &&
        product.size == size &&
        product.stock > 0
      ) {
        return false;
      }
    }
    return true;
  };

  const renderVariants = () => {
    if (!vColors || !vColors.length) {
      return null;
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ml-1 font-semibold">{selectedVColor}</span>
          </span>
        </label>
        <div className="mt-2">
          {vColors.length &&
            vColors.map((color) => (
              <div
                style={{
                  border:
                    color.name === selectedVColor ? "1px solid #2B2B2A" : "",
                  borderRadius: "30px",
                  display: "inline-block",
                  padding: "4px",
                }}
                key={`vc-${color.name}`}
              >
                <button
                  onClick={() => handlecolorChange(color.name)}
                  style={{
                    borderRadius: "30px",
                    width: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "30px",
                    backgroundColor: color.colorCode,
                  }}
                ></button>
              </div>
            ))}
        </div>
      </div>
    );
  };
  const renderSizeList = () => {
    if (!vSizes || vSizes.length === 0) {
      return null;
    }
    return (
      <div>
        <div className="flex font-medium text-sm justify-between">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ml-1 font-semibold">{selectedVSize}</span>
            </span>
          </label>
          <div>
            {vSizes.length &&
              vSizes.map((size) => {
                const isActive = size === selectedVSize;
                const sizeOutStock = isSizeOutOfStock(size);
                const isExists = getProductVariant(size);
                if (!isExists) {
                  return <></>;
                }

                return (
                  <button
                    onClick={() => handleSizeChange(size)}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #2B2B2A",
                      marginRight: "10px",
                      marginTop: "10px",
                      backgroundColor: sizeOutStock
                        ? isActive
                          ? "#2B2B2A "
                          : "#E3E5E4"
                        : isActive
                        ? "#2B2B2A "
                        : "white",
                      minWidth: "70px",
                      height: "50px",
                      color: isActive ? "white" : "#2B2B2A",
                    }}
                    key={`vs-${size}`}
                  >
                    {size}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const [edit, setEdit] = useState(false);
  const handleEditProduct = () => {
    setEditedProduct(product);
    setEdit(true);
  };

  return (
    <React.Fragment>
      {edit ? (
        <AddProduct Edit={true} editedProduct={editedProduct} />
      ) : (
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Product" breadcrumbItem="Product Details"  link="/product"/>
            <div className="d-flex justify-content-end mb-3" style={{gap:"20px"}}>
              <Link
                to={`/add-variant?productCode=${product?.productCode}&productId=${product?._id}&category=${product?.categoryId}`}
                style={{ textDecoration: "none" }}
              >
                <button
                  // onClick={handleEditProduct}

                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "100px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                >
                  Add Variant
                </button>
              </Link>
              <button
                onClick={handleEditProduct}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  width: "100px",
                  height: "40px",
                  borderRadius: "10px",
                 
                }}
              >
                Edit Product
              </button>
            </div>
            {/* <div className="d-flex justify-content-end mb-3">
              <button
                onClick={handleEditProduct}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  width: "100px",
                  height: "40px",
                  borderRadius: "10px",
                }}
              >
                Edit Product
              </button>
            </div> */}
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader>
                    <Row>
                      <Col xl={6}>
                        <div
                          className="mb-3"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <label
                            htmlFor="sizeDropdown"
                            className="form-label"
                          ></label>
                          <div className="btn-group" role="group">
                            {renderVariants()}
                          </div>
                        </div>
                      </Col>
                      <Col xl={6}>
                        <div
                          className="mb-3"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <label
                            htmlFor="colorDropdown"
                            className="form-label"
                          ></label>
                          <div className="btn-group" role="group">
                            {renderSizeList()}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>

                  <CardBody>
                    <form action="#">
                      <div>
                        <Row>
                          <Col xl={6}>
                            <div
                              className="mb-3"
                              style={{ display: "flex", gap: "4px" }}
                            >
                              <label
                                htmlFor="cleave-date"
                                className="form-label"
                              >
                                Name:
                              </label>
                              <p className="form-control-static">
                                {product?.productName}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="cleave-time-format"
                                className="form-label"
                              >
                                Description:
                              </label>
                              <p className="form-control-static">
                                {product?.description}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="border mt-3 border-dashed"></div>
                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="cleave-time-format"
                                className="form-label"
                              >
                                {" "}
                                Short Description:
                              </label>
                              <p className="form-control-static">
                                {product?.shortDescription}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="cleave-time-format"
                                className="form-label"
                              >
                                Images:
                              </label>

                              <div style={{ display: "flex" }}>
                                {product?.images.map((item, index) => (
                                  <div
                                    key={index}
                                    className="relative"
                                    style={{ marginRight: "10px" }}
                                  >
                                    <img
                                      src={item?.fileURL}
                                      className="w-full rounded-2xl object-cover products-image"
                                      onClick={() =>
                                        handleImageClick(item?.fileURL)
                                      }
                                      alt={`product detail ${index + 1}`}
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="border mt-3 border-dashed"></div>

                      <div className="mt-4">
                        <Row>
                          <Col xl={6}>
                            <div
                              className="mb-3"
                              style={{ display: "flex", gap: "4px" }}
                            >
                              <label
                                htmlFor="cleave-phone"
                                className="form-label"
                              >
                                Price:
                              </label>
                              <p className="form-control-static">
                                {product?.price}
                              </p>
                            </div>
                          </Col>

                          <Col xl={6}>
                            <div
                              className="mb-3"
                              style={{ display: "flex", gap: "4px" }}
                            >
                              <label
                                htmlFor="cleave-numeral"
                                className="form-label"
                              >
                                Selling Price:
                              </label>
                              <p className="form-control-static">
                                {product?.sellingPrice}
                              </p>
                            </div>
                          </Col>
                          <Col xl={6}>
                            <div
                              className="mb-3"
                              style={{ display: "flex", gap: "4px" }}
                            >
                              <label
                                htmlFor="cleave-numeral"
                                className="form-label"
                              >
                                {" "}
                                mrp:
                              </label>
                              <p className="form-control-static">
                                {product?.mrp}
                              </p>
                            </div>
                          </Col>
                          <Col xl={6}>
                            <div
                              className="mb-3"
                              style={{ display: "flex", gap: "4px" }}
                            >
                              <label
                                htmlFor="cleave-numeral"
                                className="form-label"
                              >
                                {" "}
                                Stock:
                              </label>
                              <p className="form-control-static">
                                {product?.stock}
                              </p>
                            </div>
                          </Col>
                          <Col xl={6}>
                            <div
                              className="mb-3"
                              style={{ display: "flex", gap: "4px" }}
                            >
                              <label
                                htmlFor="cleave-numeral"
                                className="form-label"
                              >
                                {" "}
                                tags:
                              </label>
                              <p className="form-control-static">
                                {product?.tags}
                              </p>
                            </div>
                          </Col>
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
