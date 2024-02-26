import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, CardBody, CardText, CardTitle, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Truck, CreditCard } from 'feather-icons-react';
import "./settings.css"
import { gql, useMutation, useQuery } from '@apollo/client';
import { formatCurrency } from 'src/utils/formatCurrency';
import { toast } from 'react-toastify';


//  types for state variable
interface ShippingSettings {
    shippingCharge: number;
    freeShippingThreshold: number;
    returnPeriod: number;
}

function Settings() {

    const initialShippingSettings: ShippingSettings = {
        shippingCharge: 0,
        freeShippingThreshold: 0,
        returnPeriod: 0
    };



    const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(initialShippingSettings);



    const [paymentCod, setPaymentCod] = useState(false);
    const [paymentOnline, setPaymentOnline] = useState(false);


    const [shippingEdit, setShippingEdit] = useState(false);


    const GET_SHIPPING_SETTINGS = gql`
    query GetShippingSettings {
      getShippingSettings {
        shippingCharge
        freeShippingThreshold
        returnPeriod
        }
    }
`;
    const GET_PAYMENT_SETTINGS = gql`
    query GetPaymentSettings {
  getPaymentSettings {
    cod
    onlinePayment
  }
}
`;

    const {
        data: shippingData,
        loading: shippingLoading,
        refetch: shippingRefetch,
    } = useQuery(GET_SHIPPING_SETTINGS, {
        variables: {
        },
    });

    const {
        data: paymentData,
        refetch: paymentRefetch,
    } = useQuery(GET_PAYMENT_SETTINGS, {
        variables: {
        },
    });

    useEffect(() => {
        if (shippingData && shippingData.getShippingSettings) {
            let items = shippingData.getShippingSettings;
            setShippingSettings(items);
        }
    }, [shippingData, shippingRefetch, shippingLoading]);



    useEffect(() => {
        if (paymentData && paymentData.getPaymentSettings) {
            let items = paymentData.getPaymentSettings;
            setPaymentCod(items.cod)
            setPaymentOnline(items.onlinePayment)
        }
    }, [paymentData]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingSettings((prevSettings) => ({
            ...prevSettings,
            [name]: parseFloat(value) || 0,
        }));
    };


    const UPDATE_SHIPPING_SETTINGS = gql`
    mutation UpdateShippingSettings($input: UpdateShippingSettingsInput!) {
    updateShippingSettings(input: $input) {
    shippingCharge
    freeShippingThreshold
    returnPeriod
  }
}
    `;

    const [UpdateShippingSettings] = useMutation(UPDATE_SHIPPING_SETTINGS);


    const handleShippingSettingsUpdate = async () => {
        try {
            const result = await UpdateShippingSettings({
                variables: {
                    input: {
                        shippingCharge: shippingSettings.shippingCharge,
                        returnPeriod: shippingSettings.returnPeriod,
                        freeShippingThreshold: shippingSettings.freeShippingThreshold,
                    },
                },
            });

            if (result.data.updateShippingSettings) {
                toast.success("Shipping settings has been updated");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const handleShippingSettingsCancel = async () => {
        await shippingRefetch();
        if (shippingData && shippingData.getShippingSettings) {
            let items = shippingData.getShippingSettings;
            setShippingSettings(items);
        }
    }


    const UPDATE_PAYMENT_SETTINGS = gql`
    mutation UpdatePaymentSettings($input: UpdatePaymentSettingsInput!) {
    updatePaymentSettings(input: $input) {
    onlinePayment
    cod
  }
}
    `;

    const [UpdatePaymentSettings] = useMutation(UPDATE_PAYMENT_SETTINGS);



    const handlePaymentSettingsCOD = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setPaymentCod(checked)

        try {
            const result = await UpdatePaymentSettings({
                variables: {
                    input: {
                        cod: checked,
                        onlinePayment: paymentOnline
                    }
                }
            });

            if (result.data.updatePaymentSettings) {
                toast.success("Payment settings have been updated");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handlePaymentSettingsOnline = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setPaymentOnline(checked)
        try {
            const result = await UpdatePaymentSettings({
                variables: {
                    input: {
                        onlinePayment: checked,
                        cod: paymentCod
                    }
                }
            });

            if (result.data.updatePaymentSettings) {
                toast.success("Payment settings have been updated");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const items = [
        { text: "Dashboard", link: `/` },
    ];

    return (
        <React.Fragment>

            <div className="page-content">
                <Container fluid={true}>
                    {/* <Breadcrumbs items={items} currentPage="Settings" /> */}

                    <div>

                        <Row >
                            <Col xl={12} >
                                <div style={{}} className="clickable-card-container" >
                                    <Card
                                        body
                                        className="my-2 clickable-card"
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", marginBottom: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "10px" }}>
                                                <div>
                                                    <Truck icon={"truck"} size={55} color={"#e30613"} />
                                                </div>
                                                <CardTitle tag="h5" style={{ color: "#e30613" }}>
                                                    Customize Shipping
                                                </CardTitle>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", }}>
                                                <Label style={{ marginTop: "2px", marginLeft: "10px", width: "50px" }} check>Edit :</Label>
                                                <div className="form-control-static" >

                                                    <FormGroup switch>
                                                        <Input
                                                            type="switch"
                                                            style={{ width: '40px', height: "20px" }}
                                                            checked={shippingEdit}
                                                            onChange={(e) => setShippingEdit(e.target.checked)}
                                                        />
                                                        <Label style={{ marginTop: "2px", marginLeft: "10px" }} check>{shippingEdit ? "on" : "off"}</Label>
                                                    </FormGroup>

                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                                            <div style={{ margin: "10px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <p style={{ width: "200px" }}>Shipping Charge</p>
                                                        <div style={{ width: "300px" }} className="form-control-static" >
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">&#x20B9;</span>
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    name="shippingCharge"
                                                                    id="shippingCharge"
                                                                    value={shippingSettings.shippingCharge}
                                                                    onChange={handleInputChange}
                                                                    disabled={!shippingEdit}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <p style={{ width: "200px" }}>Free Threshold</p>
                                                        <div style={{ width: "300px" }} className="form-control-static" >
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">&#x20B9;</span>
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    name="freeShippingThreshold"
                                                                    id="freeShippingThreshold"
                                                                    value={shippingSettings.freeShippingThreshold}
                                                                    onChange={handleInputChange}
                                                                    disabled={!shippingEdit}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <p style={{ width: "200px" }}>Return Period (days)</p>
                                                        <div style={{ width: "300px" }} >
                                                            <p className="form-control-static"  >
                                                                <div className="input-group">
                                                                    <Input
                                                                        type="text"
                                                                        name="returnPeriod"
                                                                        id="returnPeriod"
                                                                        value={shippingSettings.returnPeriod}
                                                                        onChange={handleInputChange}
                                                                        disabled={!shippingEdit}
                                                                    />
                                                                </div>
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                                                    <Button disabled={!shippingEdit} color='primary' onClick={handleShippingSettingsUpdate}>Update</Button>
                                                    {/* <Button color='secondary' onClick={handleShippingSettingsCancel}>Cancel</Button> */}
                                                </div>

                                            </div>

                                        </div>
                                    </Card>
                                </div>
                            </Col>

                            <Col xl={12} >
                                <div className="clickable-card-container" >
                                    <Card
                                        body
                                        className="my-2 clickable-card"
                                        style={{
                                            width: '100%',
                                            height: "100%"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "10px" }}>
                                            <div>
                                                <CreditCard size={55} color={"#e30613"} />
                                            </div>
                                            <CardTitle tag="h5" style={{ color: "#e30613" }}>
                                                Payment Options
                                            </CardTitle>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                                            <div style={{ margin: "10px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <p style={{ width: "200px" }}>Cash On Delivery</p>
                                                        <div style={{ width: "300px" }} className="form-control-static" >

                                                            <FormGroup switch>
                                                                <Input
                                                                    type="switch"
                                                                    style={{ width: '40px', height: "20px" }}
                                                                    checked={paymentCod}
                                                                    onChange={handlePaymentSettingsCOD}
                                                                />
                                                                <Label style={{ marginTop: "3px", marginLeft: "10px" }} check>{paymentCod === true ? "On" : "Off"}</Label>
                                                            </FormGroup>

                                                        </div>
                                                    </div>

                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <p style={{ width: "200px" }}>Online Payment</p>
                                                        <div style={{ width: "300px" }} className="form-control-static" >
                                                            <FormGroup switch>
                                                                <Input
                                                                    type="switch"
                                                                    style={{ width: '40px', height: "20px" }}
                                                                    checked={paymentOnline}
                                                                    onChange={handlePaymentSettingsOnline}
                                                                />
                                                                <Label style={{ marginTop: "3px", marginLeft: "10px" }} check>{paymentOnline === true ? "On" : "Off"}</Label>
                                                            </FormGroup>
                                                        </div>

                                                    </div>


                                                </div>

                                                {/* <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                                                    <Button color='primary' onClick={handleShippingSettingsUpdate}>Update</Button>
                                                    <Button color='secondary' onClick={handleShippingSettingsCancel}>Cancel</Button>
                                                </div> */}

                                            </div>

                                        </div>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </div>


                </Container >
            </div>

        </React.Fragment >
    )
}

export default Settings