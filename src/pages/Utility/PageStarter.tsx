import React from "react";
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PageStarter = () => {
  document.title = "Starter Page | collin";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Pages" breadcrumbItem="Starter Page"  link={"#"}/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PageStarter;
