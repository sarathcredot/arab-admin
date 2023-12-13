import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardBody,
  Col,
  Card,
} from "reactstrap";
import classnames from "classnames";

//SimpleBar
import SimpleBar from "simplebar-react";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<string>("1");

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Recent orders</h4>
            <div className="flex-shrink-0">
              {/* <Nav
                className="justify-content-end nav-tabs-custom rounded card-header-tabs"
                role="tablist"
              >
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    All
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggle("2");
                    }}
                  >
                    Buy
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      toggle("3");
                    }}
                  >
                    Sell
                  </NavLink>
                </NavItem>
              </Nav> */}
            </div>
          </div>

          <CardBody className="px-0">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <SimpleBar
                  className="table-responsive px-3"
                  style={{ maxHeight: "352px" }}
                >
                  <table className="table align-middle table-nowrap table-borderless">
                    <tbody >
                      <tr  style={{borderRadius:"36px",backgroundColor:"#FAF9F9"}}>
                        <td style={{ width: "50px" }}>
                          <div className="font-size-22 text-success">
                            <i className="bx bx-down-arrow-circle d-block"></i>
                          </div>
                        </td>

                        <td>
                          <div>
                            <h5 className="font-size-14 mb-1">Shirt</h5>
                            <p className="text-muted mb-0 font-size-12">
                              14 Mar, 2021
                            </p>
                          </div>
                        </td>

                        <td>
                          <div className="text-end">
                            <h5 className="font-size-14 mb-0"> ₹20</h5>
                            {/* <p className="text-muted mb-0 font-size-12">
                              Coin Value
                            </p> */}
                          </div>
                        </td>

                        <td>
                          <div className="text-end">
                            <h5 className="font-size-14 text-muted mb-0">
                            ₹20
                            </h5>
                            <p className="text-muted mb-0 font-size-12">
                              Amount
                            </p>
                          </div>
                        </td>
                      </tr>

                      <tr  style={{borderRadius:"36px",backgroundColor:"#FAF9F9"}}>
                        <td style={{ width: "50px" }}>
                          <div className="font-size-22 text-success">
                            <i className="bx bx-down-arrow-circle d-block"></i>
                          </div>
                        </td>

                        <td>
                          <div>
                            <h5 className="font-size-14 mb-1">Shirt</h5>
                            <p className="text-muted mb-0 font-size-12">
                              14 Mar, 2021
                            </p>
                          </div>
                        </td>

                        <td>
                          <div className="text-end">
                            <h5 className="font-size-14 mb-0"> ₹20</h5>
                            {/* <p className="text-muted mb-0 font-size-12">
                              Coin Value
                            </p> */}
                          </div>
                        </td>

                        <td>
                          <div className="text-end">
                            <h5 className="font-size-14 text-muted mb-0">
                            ₹20
                            </h5>
                            <p className="text-muted mb-0 font-size-12">
                              Amount
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr  style={{borderRadius:"36px",backgroundColor:"#FAF9F9"}}>
                        <td style={{ width: "50px" }}>
                          <div className="font-size-22 text-success">
                            <i className="bx bx-down-arrow-circle d-block"></i>
                          </div>
                        </td>

                        <td>
                          <div>
                            <h5 className="font-size-14 mb-1">Shirt</h5>
                            <p className="text-muted mb-0 font-size-12">
                              14 Mar, 2021
                            </p>
                          </div>
                        </td>

                        <td>
                          <div className="text-end">
                            <h5 className="font-size-14 mb-0"> ₹20</h5>
                            {/* <p className="text-muted mb-0 font-size-12">
                              Coin Value
                            </p> */}
                          </div>
                        </td>

                        <td>
                          <div className="text-end">
                            <h5 className="font-size-14 text-muted mb-0">
                            ₹20
                            </h5>
                            <p className="text-muted mb-0 font-size-12">
                              Amount
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </SimpleBar>
              </TabPane>

              
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default Transactions;
