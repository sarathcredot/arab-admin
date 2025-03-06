import React from "react";
import { Row, Table } from "reactstrap";
import styles from "../style.module.css";
import moment from "moment";
import { capitalCase } from "change-case";
import { IActivities } from "../Order/OrderActivityLogs";

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
                <th>Performed By</th>
                {/* <th>Affected Entity</th> */}
                <th>Description</th>
                <th>Time Taken</th>
              </tr>
            </thead>

            <tbody>
              {activities?.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td>{item?.action}</td>
                  <td>{moment(item?.createdAt).format("DD MMMM, hh:mm A")}</td>
                  <td>{`${capitalCase(item?.performedByRole)} - ${item?.performedByDetails[0]?.name}`}</td>
                  <td>{item?.details}</td>
                  <td>{item?.timeDifference ? moment.duration(item?.timeDifference, "seconds").humanize() : ""}</td>
                  {/* <td>{item?.timeDifference}</td> */}
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
