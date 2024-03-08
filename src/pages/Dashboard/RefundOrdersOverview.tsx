import React from 'react';
import { Col, Row } from 'reactstrap';
import RefundGraphCard from './RefundGraphCard';
import RefundTransactions from './RefundTransactions';

function RefundOrdersOverview({ vendorId }: any) {

    return (
        <>
            <Row>
                <Col xs={12} sm={12} xl={6}>
                    <RefundTransactions vendorId={vendorId} />
                </Col>
                <Col xs={12} sm={12} xl={6}>
                    <RefundGraphCard vendorId={vendorId} />
                </Col>


            </Row>
        </>
    )
}

export default RefundOrdersOverview