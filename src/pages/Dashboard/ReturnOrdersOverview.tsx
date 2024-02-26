import React from 'react';
import { Col, Row } from 'reactstrap';
import ReturnGraphCard from './ReturnGraphCard';
import Transactions from './Transactions';

function ReturnOrdersOverview() {


    return (
        <>
            <Row>
                <Col xs={12} sm={12} xl={6}>
                    <ReturnGraphCard />
                </Col>
                <Col xs={12} sm={12} xl={6}>
                    <Transactions />
                </Col>


            </Row>
        </>
    )
}

export default ReturnOrdersOverview