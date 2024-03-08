import React from "react";
import { Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { capitalCase, sentenceCase } from "change-case";
import userAvatar from "src/assets/images/users/user-dummy-img.jpg";

function OrderShippingAddress({ order }: any) {

    const navigate = useNavigate();

    return (
        <div>
            <Row style={{ display: "flex", flexDirection: "column", gap: "40px", }} >
                <Col xl={12} onClick={() => navigate(`/user/view?userId=${order?.userId}`)} style={{ cursor: "pointer" }}>
                    <div
                        className="mb-3"
                        style={{ display: "flex", gap: "4px" }}
                    >
                        <label

                            htmlFor="cleave-date"
                            className="form-label"
                        >
                            User Profile:
                        </label>

                    </div>

                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "30px" }}>
                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", }}>
                            <img width={"100%"} height={"100%"} style={{ borderRadius: "50%" }} src={userAvatar} />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid  rgba(0, 0, 0,0.3)", borderRadius: "7px", padding: "4px 10px", width: "350px", }}>
                            <p className="form-control-static" style={{ fontSize: "12px", margin: 0 }}>
                                Fullname:
                            </p>
                            <p className="form-control-static" style={{ fontWeight: 500, margin: 0 }}>
                                {order?.shippingAddress.firstname && capitalCase(order?.shippingAddress.firstname)}
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(0, 0, 0,0.3)", borderRadius: "7px", padding: "4px 10px", width: "350px" }}>
                            <p className="form-control-static" style={{ fontSize: "12px", margin: 0 }}>
                                Id:
                            </p>
                            <p className="form-control-static" style={{ fontWeight: 500, margin: 0 }}>
                                {order?.userId}
                            </p>
                        </div>
                    </div>

                </Col>

                <Col xl={12}>
                    <div
                        className="mb-3"
                        style={{ display: "flex", gap: "4px" }}
                    >
                        <label
                            htmlFor="cleave-date"
                            className="form-label"
                        >
                            Shipping Address:
                        </label>

                    </div>

                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ width: "200px" }}>
                                <p className="form-control-static">First Name</p>
                                <p className="form-control-static">Email</p>
                                <p className="form-control-static">Mobile</p>
                                <p className="form-control-static">Street Name</p>
                                <p className="form-control-static">City</p>
                                <p className="form-control-static">House Number</p>
                                <p className="form-control-static">Country</p>
                                <p className="form-control-static">Postcode</p>
                                <p className="form-control-static">Apartment</p>
                                <p className="form-control-static">Suite</p>
                                <p className="form-control-static">Unit</p>
                            </div>
                            <div>
                                <p className="form-control-static">{order?.shippingAddress?.firstname || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.email || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.mobile || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.streetName || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.city || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.houseNumber || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.country || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.postCode || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.apartment || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.suite || "nill"}</p>
                                <p className="form-control-static">{order?.shippingAddress?.unit || "nill"}</p>
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>
        </div>
    )
}

export default OrderShippingAddress