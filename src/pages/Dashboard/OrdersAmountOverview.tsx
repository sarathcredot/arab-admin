import React from 'react';
import { Col, Row } from 'reactstrap';
import RefundGraphCard from './RefundGraphCard';
import RefundTransactions from './RefundTransactions';
import OrderAmountGraphCard from './OrderAmountGraphCard';
import ShippingChargeGraphCard from './ShippingChargeGraphCard';

function OrdersAmountOverview({ vendorId }: any) {

    return (
        <>
            <Row>
                <Col xs={12} sm={12} xl={6}>
                    <OrderAmountGraphCard vendorId={vendorId} />
                </Col>
                <Col xs={12} sm={12} xl={6}>
                    <ShippingChargeGraphCard vendorId={vendorId} />
                </Col>


            </Row>
        </>
    )
}

export default OrdersAmountOverview