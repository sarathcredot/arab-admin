import React from 'react';
import { Col, Row } from 'reactstrap';
import ReturnGraphCard from './ReturnGraphCard';
import Transactions from './Transactions';

function ReturnOrdersOverview({ vendorId }: any) {


    return (
        <>
            <Row>
                <Col xs={12} sm={12} xl={6}>
                    <ReturnGraphCard vendorId={vendorId} />
                </Col>
                <Col xs={12} sm={12} xl={6}>
                    <Transactions vendorId={vendorId} />
                </Col>


            </Row>
        </>
    )
}

export default ReturnOrdersOverview