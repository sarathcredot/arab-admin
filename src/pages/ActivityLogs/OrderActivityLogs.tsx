import React from "react";
import { Card, CardBody, CardHeader, Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";

import img1 from "../../assets/images/small/img-2.jpg";
import img2 from "../../assets/images/small/img-5.jpg";
import Breadcrumb from "../../components/Common/Breadcrumb";

const OrderActivityLogs = () => {
  const [searchParams] = useSearchParams();
  const ORDER_ID = searchParams.get("orderId");
  const ID = searchParams.get("_id");

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Shipping Orders", link: `/shipping-orders` },
    { text: "Details", link: `/shipping-orders/details?orderId=${ORDER_ID}&_id=${ID}` },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          {/* <Breadcrumbs title="Pages" breadcrumbItem="Timeline" /> */}
          <Breadcrumb
            items={items}
            currentPage="Activity Log"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">ORD-1740655835856-1 Activity Log</h4>
                </CardHeader>

                <CardBody>
                  <Row className="justify-content-center">
                    <Col xl={10}>
                      <div className="timeline">
                        <div className="timeline-container">
                          <div className="timeline-end">
                            <p>Start</p>
                          </div>
                          <div className="timeline-continue">
                            <Row className="timeline-right">
                              <Col md={6}>
                                <div className="timeline-icon">
                                  {/* <i className="bx bx-briefcase-alt-2 text-primary h2 mb-0"></i> */}
                                  <p className="text-primary mb-0">10:12 AM</p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">25</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">ORDER HAS BEEN PLACED</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">
                                        David Johnson placed an order through the website. The system generated the
                                        order ID, and the request was sent for processing
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row className="timeline-left">
                              <Col
                                md={6}
                                className="d-md-none d-block"
                              >
                                <div className="timeline-icon">
                                  {/* <i className="bx bx-user-pin text-primary h2 mb-0"></i> */}
                                  <p className="text-primary mb-0">10:12 AM</p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">27</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">PACKAGING STARTED</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">
                                        James Smith from the warehouse team picked the items and started the packaging
                                        process.
                                      </p>

                                      {/* <div className="d-flex flex-wrap align-items-start event-img mt-3 gap-2">
                                        <img
                                          src={img1}
                                          alt=""
                                          className="img-fluid rounded"
                                          width="60"
                                        />
                                        <img
                                          src={img2}
                                          alt=""
                                          className="img-fluid rounded"
                                          width="60"
                                        />
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col
                                md={6}
                                className="d-md-block d-none"
                              >
                                <div className="timeline-icon">
                                  {/* <i className="bx bx-user-pin text-primary h2 mb-0"></i> */}
                                  <p className="text-primary mb-0">1:20 PM</p>
                                </div>
                              </Col>
                            </Row>

                            <div className="row timeline-right">
                              <Col md={6}>
                                <div className="timeline-icon">
                                  {/* <i className="bx bx-bar-chart-square text-primary h2 mb-0"></i> */}
                                  <p className="text-primary mb-0">10:10 AM</p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">28</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">ORDER SHIPPED</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">
                                        Michael Brown marked the order as Shipped. The package is now in transit to the
                                        delivery hub.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </div>

                            <Row className="timeline-left">
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">28</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">DELIVERY BOY ASSIGNED</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">
                                        Michael Brown assigned John Doe as the delivery agent for this order.
                                      </p>

                                      {/* <button
                                        type="button"
                                        className="btn btn-primary btn-rounded waves-effect waves-light mt-4"
                                      >
                                        See more detail
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col
                                md={6}
                                className="d-md-block d-none"
                              >
                                <div className="timeline-icon">
                                  {/* <i className="bx bx-camera text-primary h2 mb-0"></i> */}
                                  <p className="text-primary mb-0">2:30 PM</p>
                                </div>
                              </Col>
                            </Row>

                            <Row className="timeline-right">
                              <Col md={6}>
                                <div className="timeline-icon">
                                  {/* <i className="bx bx-pie-chart-alt text-primary h2 mb-0"></i> */}
                                  <p className="text-primary mb-0">5:45 PM</p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">28</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18"> OUT FOR DELIVERY</h3>

                                      <p className="mb-0 mt-2 pt-1 text-muted">
                                        The package is now marked as Out for Delivery and is on its way to the customer.
                                        {/* <Link to="#">Read more</Link> */}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row className="timeline-left">
                              <Col md={6}>
                                <div className="timeline-box">
                                  <div className="timeline-date bg-primary text-center rounded">
                                    <h3 className="text-white mb-0">28</h3>
                                    <p className="mb-0 text-white-50">June</p>
                                  </div>
                                  <div className="event-content">
                                    <div className="timeline-text">
                                      <h3 className="font-size-18">ORDER DELIVERED</h3>
                                      <p className="mb-0 mt-2 pt-1 text-muted">
                                        John Doe successfully delivered the package to David Johnson at the provided
                                        address. The order status changed to Delivered.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col
                                md={6}
                                className="d-md-block d-none"
                              >
                                <div className="timeline-icon d-flex gap-1 align-items-center">
                                  {/* <i className="bx bx-home-alt text-primary h2 mb-0"></i> */}
                                  {/* <i className='bx bx-time text-primary h5  mb-0'></i> */}
                                  <p className="text-primary mb-0">6:30 PM</p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div className="timeline-start ">
                            {/* <p>End</p> */}
                            <p className="m-0 p-3 ">
                              <i className="bx bx-chevron-down h1 text-white"></i>
                            </p>
                          </div>
                          {/* completed card */}
                          {/* <div className="timeline-launch">
                            <div className="timeline-box">
                              <div className="timeline-text">
                                <h3 className="font-size-18">Launched our company on 21 June 2021</h3>
                                <p className="text-muted mb-0">Pellentesque sapien ut est.</p>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default OrderActivityLogs;
