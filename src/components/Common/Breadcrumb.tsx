import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";
import { capitalCase } from "change-case";

interface BreadcrumbItems {
  text: string;
  link: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItems[];
  currentPage: string;
  title?: string;
  link?: string;
  breadcrumbItem?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  return (
    <Row>
      <Col xs={12}>
        <div className="page-title-right">
          <ol className="breadcrumb m-0" style={{ marginBottom: "10px" }}>
            {items?.map((item, index) => (
              <BreadcrumbItem key={index}>
                <Link to={item.link} >
                  {capitalCase(item.text)}
                </Link>
              </BreadcrumbItem>
            ))}
            <BreadcrumbItem active>
              <span >{currentPage && capitalCase(currentPage)}</span>
            </BreadcrumbItem>
          </ol>
        </div>
        <div style={{ marginTop: "20px" }} className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{currentPage && capitalCase(currentPage)}</h4>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;
