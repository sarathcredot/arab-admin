import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Collapse,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Col
} from "reactstrap";

interface FilterOption {
    label: string;
    type: string; // 'text' | 'date' | 'select'
    name: string;
    options?: { value: string; label: string }[];
}

interface FilterData {
    [key: string]: string;
}

interface DynamicFilterProps {
    filterOptions: FilterOption[];
    onSubmit: (formData: FilterData) => void;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({ filterOptions, onSubmit }) => {
    const initialFormData: FilterData = {};
    filterOptions.forEach(option => {
        initialFormData[option.name] = '';
    });

    const [formData, setFormData] = useState<FilterData>(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleReset = () => {
        setFormData(initialFormData);
        onSubmit(initialFormData);
    };

    const chunkArray = (array: any[], size: number) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    };

    const getColSize = (length: number) => {
        if (length === 2) return 6;
        if (length === 3) return 4;
        if (length === 4) return 3;
        return 12;
    };

    return (
        <Card>
            <CardBody>
                <CardTitle>
                    <CardTitle><h4 style={{ marginBottom: "20px" }}>Filters</h4></CardTitle>
                </CardTitle>

                <Form onSubmit={handleSubmit}>
                    {chunkArray(filterOptions, 4).map((row, index) => (
                        <Row key={index}>
                            {row.map((option: any, idx: any) => (
                                <Col key={idx} md={getColSize(row.length)}>
                                    <FormGroup>
                                        <Label for={option.name}>{option.label}</Label>
                                        {option.type === 'select' ? (
                                            <Input
                                                type={option.type}
                                                name={option.name}
                                                id={option.name}
                                                value={formData[option.name]}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select {option.label}</option>
                                                {option.options?.map((opt: any, idx: any) => (
                                                    <option key={idx} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </Input>
                                        ) : (
                                            <Input
                                                type={option.type}
                                                name={option.name}
                                                id={option.name}
                                                value={formData[option.name]}
                                                onChange={handleChange}
                                            />
                                        )}
                                    </FormGroup>
                                </Col>
                            ))}
                        </Row>
                    ))}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button color="primary" type="submit">Apply Filters</Button>
                        <Button onClick={handleReset} style={{ marginLeft: '10px' }}> Reset</Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    );
};

export default DynamicFilter;
