import React from 'react'
import { useNavigate } from 'react-router'
import { Card, Col, Row } from 'reactstrap'
import Iconify from 'src/components/iconify'

function VendorCards({ id }: any) {
    const navigate = useNavigate();
    return (
        <Row>
            <Col xs={3}>
                <Card onClick={() => navigate(`analytics?id=${id}`)}
                    body
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'primary',
                        backgroundColor: 'white',
                        boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer"
                    }}
                >
                    <div
                        style={{
                            margin: 'auto',
                            display: 'flex',
                            borderRadius: '50%',
                            alignItems: 'center',
                            width: '54px',
                            height: '54px',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            color: 'rgba(227, 6, 19, 1)',
                            background: " rgba(227, 6, 19, 0.1)"

                        }}
                    >
                        <Iconify icon={"material-symbols:analytics"} width={22} />
                    </div>

                    <p style={{
                        "fontWeight": "500",
                        "fontSize": "14px",
                        "lineHeight": "27px",
                        "color": "#000000"
                    }}>{"Analytics"}</p>
                </Card>
            </Col>
            <Col xs={3}>
                <Card onClick={() => navigate(`/shipping-orders?vendorId=${id}`)}
                    body
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'primary',
                        backgroundColor: 'white',
                        boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer"
                    }}
                >
                    <div
                        style={{
                            margin: 'auto',
                            display: 'flex',
                            borderRadius: '50%',
                            alignItems: 'center',
                            width: '54px',
                            height: '54px',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            color: 'rgba(227, 6, 19, 1)',
                            background: " rgba(227, 6, 19, 0.1)"

                        }}
                    >
                        <Iconify icon={"fa-solid:shipping-fast"} width={22} />
                    </div>

                    <p style={{
                        "fontWeight": "500",
                        "fontSize": "14px",
                        "lineHeight": "27px",
                        "color": "#000000"
                    }}>{"Shipping"}</p>
                </Card>
            </Col>
            <Col xs={3}>
                <Card
                    onClick={() => navigate(`/return-orders?vendorId=${id}`)}
                    body
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'primary',
                        backgroundColor: 'white',
                        boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer"
                    }}
                >
                    <div
                        style={{
                            margin: 'auto',
                            display: 'flex',
                            borderRadius: '50%',
                            alignItems: 'center',
                            width: '54px',
                            height: '54px',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            color: 'rgba(227, 6, 19, 1)',
                            background: " rgba(227, 6, 19, 0.1)"

                        }}
                    >
                        <Iconify icon={"tabler:truck-return"} width={22} />
                    </div>

                    <p style={{
                        "fontWeight": "500",
                        "fontSize": "14px",
                        "lineHeight": "27px",
                        "color": "#000000"
                    }}>{"Return"}</p>
                </Card>
            </Col>
            <Col xs={3}>
                <Card
                    onClick={() => navigate(`/refund-orders?vendorId=${id}`)}
                    body
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'primary',
                        backgroundColor: 'white',
                        boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer"
                    }}
                >
                    <div
                        style={{
                            margin: 'auto',
                            display: 'flex',
                            borderRadius: '50%',
                            alignItems: 'center',
                            width: '54px',
                            height: '54px',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            color: 'rgba(227, 6, 19, 1)',
                            background: " rgba(227, 6, 19, 0.1)"

                        }}
                    >
                        <Iconify icon={"ri:refund-2-line"} width={22} />
                    </div>

                    <p style={{
                        "fontWeight": "500",
                        "fontSize": "14px",
                        "lineHeight": "27px",
                        "color": "#000000"
                    }}>{"Refund"}</p>
                </Card>
            </Col>
        </Row>
    )
}

export default VendorCards