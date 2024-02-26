import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Form, FormGroup,
    Input,
    Label
} from "reactstrap";


interface FormState {
    _id: string;
    shippingStartDate: string;
    shippingEndDate: string;
    paymentMode: string;
    userId: string;
    productId: string;
    skuId: string;
    paymentStatus: string;
    shippingStatus: string;
    courierId: string;
    invoiceNumber: string;
    sort: string;
    orderId: string;
    itemId: string;
}

interface FilterData {
    _id: string;
    shippingStartDate: string;
    shippingEndDate: string;
    paymentMode: string;
    userId: string;
    productId: string;
    skuId: string;
    paymentStatus: string;
    shippingStatus: string;
    courierId: string;
    invoiceNumber: string;
    sort: string;
    orderId: string,
    itemId: string
}

interface AllOrderFiltersProps {
    onSubmit: (formData: FilterData) => void;
}

const ProductOrdersFilters: React.FC<AllOrderFiltersProps> = ({ onSubmit }) => {

    const [formData, setFormData] = useState<FormState>({
        _id: "",
        shippingStartDate: "",
        shippingEndDate: "",
        paymentMode: "",
        userId: "",
        productId: "",
        skuId: "",
        paymentStatus: "",
        shippingStatus: "",
        courierId: "",
        invoiceNumber: "",
        sort: "",
        orderId: "",
        itemId: "",

    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleReset = () => {
        setFormData({
            _id: "",
            shippingStartDate: "",
            shippingEndDate: "",
            paymentMode: "",
            userId: "",
            productId: "",
            skuId: "",
            paymentStatus: "",
            shippingStatus: "",
            courierId: "",
            invoiceNumber: "",
            sort: "",
            orderId: "",
            itemId: "",
        })

        onSubmit({
            _id: "",
            shippingStartDate: "",
            shippingEndDate: "",
            paymentMode: "",
            userId: "",
            productId: "",
            skuId: "",
            paymentStatus: "",
            shippingStatus: "",
            courierId: "",
            invoiceNumber: "",
            sort: "",
            orderId: "",
            itemId: "",
        });
    }


    return (
        <Card>
            <CardBody>
                <CardTitle><h4 style={{ marginBottom: "20px" }}>Filters</h4></CardTitle>
                <Form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="orderId">Order ID</Label>
                                <Input
                                    type="text"
                                    name="orderId"
                                    id="orderId"
                                    value={formData.orderId}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>

                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="itemId">Item ID</Label>
                                <Input
                                    type="text"
                                    name="itemId"
                                    id="itemId"
                                    value={formData.itemId}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="courierId">Courier ID</Label>
                                <Input
                                    type="text"
                                    name="courierId"
                                    id="courierId"
                                    value={formData.courierId}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="invoiceNumber">Invoice Number</Label>
                                <Input
                                    type="text"
                                    name="invoiceNumber"
                                    id="invoiceNumber"
                                    value={formData.invoiceNumber}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>

                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="skuId">SKU ID</Label>
                                <Input
                                    type="text"
                                    name="skuId"
                                    id="skuId"
                                    value={formData.skuId}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>

                    </div>

                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="productId">Product ID</Label>
                                <Input
                                    type="text"
                                    name="productId"
                                    id="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>


                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="paymentStatus">Payment Status</Label>
                                <Input
                                    type="select"
                                    name="paymentStatus"
                                    id="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                >
                                    <option value="">All</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </Input>
                            </FormGroup>
                        </div>


                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="shippingStartDate">Start Date</Label>
                                <Input
                                    type="date"
                                    name="shippingStartDate"
                                    id="shippingStartDate"
                                    value={formData.shippingStartDate}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="shippingEndDate">End Date</Label>
                                <Input
                                    type="date"
                                    name="shippingEndDate"
                                    id="shippingEndDate"
                                    value={formData.shippingEndDate}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormGroup >
                                <Label for="paymentMode">Payment Mode</Label>
                                <Input
                                    type="select"
                                    name="paymentMode"
                                    id="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleChange}
                                >
                                    <option value="">All</option>
                                    <option value="COD">COD</option>
                                    {/* <option value="ONLINE">ONLINE</option> */}
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
                        <Button color="primary" type="submit">Apply Filters</Button>
                        <Button onClick={handleReset}> Reset</Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    )
}

export default ProductOrdersFilters