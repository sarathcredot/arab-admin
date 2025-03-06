import React from "react";
import { Row, Table } from "reactstrap";
import styles from "../style.module.css";
import moment from "moment";
import { IActivities } from "../Order/OrderActivityLogs";
import { capitalize } from "lodash";
import { capitalCase } from "change-case";

type Props = {
  activities: IActivities[] | undefined;
};

const TableLog = ({ activities }: Props) => {
  return (
    <Row className={styles.opacity_anim}>
      <div className="table-rep-plugin">
        <div
          className="table-responsive mb-0"
          data-pattern="priority-columns"
        >
          <Table
            id="tech-companies-1"
            className="table table-striped table-bordered"
          >
            <thead>
              <tr>
                <th style={{ width: "30px", textAlign: "center" }}>#</th>
                <th>Action</th>
                <th>Date & Time</th>
                <th>Affected Entity</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {activities?.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{item?.action}</td>
                  <td>{moment(item?.createdAt).format("DD MMMM, hh:mm A")}</td>
                  <td>{`${capitalCase(item?.referenceType)} - ${item?.referenceDetails[0]?.ID}`}</td>
                  <td>{item?.details}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Row>
  );
};

export default TableLog;
