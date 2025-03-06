import React from "react";
import { Col, Row } from "reactstrap";
import styles from "../style.module.css";
import moment from "moment";
import { upperCase } from "lodash";
import { IActivities } from "../Order/OrderActivityLogs";

type Props = {
  activities: IActivities[] | undefined;
};

const Timeline = ({ activities }: Props) => {
  return (
    <>
      <Row className={`justify-content-center ${styles.opacity_anim}`}>
        <Col xl={10}>
          <div className="timeline">
            <div className="timeline-container">
              <div className="timeline-end">
                <p>Start</p>
              </div>
              <div className="timeline-continue">
                {activities?.map((item, index) => {
                  return index % 2 === 0 ? (
                    <>
                      <Row className="timeline-right">
                        <Col md={6}>
                          <div className="timeline-icon">
                            {/* <i className="bx bx-briefcase-alt-2 text-primary h2 mb-0"></i> */}
                            <p className="text-primary mb-0">{moment(item?.createdAt).format("hh:mm A")}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="timeline-box">
                            <div className="timeline-date bg-primary text-center rounded">
                              <h3 className="text-white mb-0">{moment(item?.createdAt).format("DD")}</h3>
                              <p className="mb-0 text-white-50">{moment(item?.createdAt).format("MMM")}</p>
                            </div>
                            <div className="event-content">
                              <div className="timeline-text">
                                <h3 className="font-size-18">{upperCase(item?.action)}</h3>
                                <p className="mb-0 mt-2 pt-1 text-muted">{item?.details}</p>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row className="timeline-left">
                        <Col md={6}>
                          <div className="timeline-box">
                            <div className="timeline-date bg-primary text-center rounded">
                              <h3 className="text-white mb-0">{moment(item?.createdAt).format("DD")}</h3>
                              <p className="mb-0 text-white-50">{moment(item?.createdAt).format("MMM")}</p>
                            </div>
                            <div className="event-content">
                              <div className="timeline-text">
                                <h3 className="font-size-18">{upperCase(item?.action)}</h3>
                                <p className="mb-0 mt-2 pt-1 text-muted">{item?.details}</p>
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
                            <p className="text-primary mb-0">{moment(item?.createdAt).format("hh:mm A")}</p>
                          </div>
                        </Col>
                      </Row>
                    </>
                  );
                })}
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
    </>
  );
};

export default Timeline;
