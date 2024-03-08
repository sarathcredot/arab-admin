
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
    startDate: string;
    endDate: string;
    paymentMode: string;
    userId: string;
    orderId: string;
}
interface FilterData {
    _id: string;
    startDate: string;
    endDate: string;
    paymentMode: string;
    userId: string;
    orderId: string;

}

interface AllOrderFiltersProps {
    onSubmit: (formData: FilterData) => void;
}

const AllOrderFilters: React.FC<AllOrderFiltersProps> = ({ onSubmit }) => {


    const [formData, setFormData] = useState<FormState>({
        _id: "",
        startDate: "",
        endDate: "",
        paymentMode: "",
        userId: "",
        orderId: ""
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
            startDate: "",
            endDate: "",
            paymentMode: "",
            userId: "",
            orderId: ""
        })

        onSubmit({
            _id: "",
            startDate: "",
            endDate: "",
            paymentMode: "",
            userId: "",
            orderId: ""
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
                                <Label >Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}

                                />
                            </FormGroup>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label >End Date</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}

                                />
                            </FormGroup>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="paymentMode">Payment Mode</Label>
                                <Input
                                    type="select"
                                    name="paymentMode"
                                    id="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleChange}

                                >
                                    <option value="">Select Payment Mode</option>
                                    <option value="COD">COD</option>
                                    {/* <option value="ONLINE">ONLINE</option> */}
                                </Input>
                            </FormGroup>
                        </div>

                        <div style={{ width: "200px" }}>
                            <FormGroup>
                                <Label for="userId">User ID</Label>
                                <Input
                                    type="text"
                                    name="userId"
                                    id="userId"
                                    value={formData.userId}
                                    onChange={handleChange}

                                />
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

export default AllOrderFilters