import React from 'react'
import { Container } from 'reactstrap'
import OrdersOverview from '../Dashboard/OrdersOverview'
import { useSearchParams } from 'react-router-dom';
import OrdersAmountOverview from '../Dashboard/OrdersAmountOverview';
import ReturnOrdersOverview from '../Dashboard/ReturnOrdersOverview';
import RefundOrdersOverview from '../Dashboard/RefundOrdersOverview';
import Breadcrumb from 'src/components/Common/Breadcrumb';

function VendorAnalyticsPage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const items = [
        { text: "Dashboard", link: `/` },
        { text: "Vendors", link: `/vendors` },
        { text: "Vendor Details", link: `/vendors/view?id=${id}` },

    ];

    return (
        <div className="page-content">

            <Container fluid={true} >
                <Breadcrumb items={items} currentPage="Vendor Orders" />
                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

                    <div>
                        <OrdersOverview vendorId={id} />
                    </div>

                    <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

                    <div>
                        <h4 style={{ margin: "20px 0" }}>Vendor Order Amounts</h4>
                        <OrdersAmountOverview vendorId={id} />
                    </div>


                    <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

                    <div>
                        <h4 style={{ margin: "10px 0 20px  0" }}>Return</h4>
                        <ReturnOrdersOverview vendorId={id} />
                    </div>

                    <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

                    <div>
                        <h4 style={{ margin: "10px 0 20px  0" }}>Refund</h4>
                        <RefundOrdersOverview vendorId={id} />
                    </div>


                </div>
            </Container>
        </div>
    )
}

export default VendorAnalyticsPage