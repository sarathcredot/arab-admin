import React from "react";
import { Container, CardHeader, Row, Col, Card } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import BasicPills from "./BasicPills";
import ProgressbarWizard from "./ProgressbarWizard";

const FormWizard = () => {
  document.title = "Form Wizard | Minia - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Forms" breadcrumbItem="Form Wizard" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Basic pills Wizard</h4>
                </CardHeader>
                <BasicPills />
              </Card>
            </Col>
          </Row>
          <ProgressbarWizard />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormWizard;
