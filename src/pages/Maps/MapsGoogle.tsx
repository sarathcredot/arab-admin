import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import PropTypes from "prop-types";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const LoadingContainer = () => <div>Loading...</div>;
document.title = "Google Maps | Minia - React Admin & Dashboard Template";

interface GoogleProps {
  google: Object;
  zoom: number;
}

const MapsGoogle = (props: any) => {
  const selectedPlace = {};

  function onMarkerClick() {
    alert("You clicked in this marker");
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Maps" breadcrumbItem="Google Maps" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Markers</h4>
                  <p className="card-title-desc">Example of google maps.</p>
                </CardHeader>
                <CardBody>
                  <div
                    id="gmaps-markers"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                    <Map
                      google={props.google}
                      style={{ width: "100%", height: "100%" }}
                    ></Map>
                    {/* <Marker
                      title={"The marker`s title will appear as a tooltip."}
                      name={"SOMA"}
                      position={{ lat: 37.778519, lng: -122.40564 }}
                    /> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Overlays</h4>
                  <p className="card-title-desc">Example of google maps.</p>
                </CardHeader>
                <CardBody>
                  <div
                    id="gmaps-overlay"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                    <Map
                      google={props.google}
                      style={{ width: "100%", height: "100%" }}
                      initialCenter={{
                        lat: 40.854885,
                        lng: -88.081807,
                      }}
                    ></Map>
                    <Marker
                      onClick={() => {
                        onMarkerClick();
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Basic</h4>
                  <p className="card-title-desc">Example of google maps.</p>
                </CardHeader>
                <CardBody>
                  <div
                    id="gmaps-markers"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                    <Map
                      google={props.google}
                      style={{ width: "100%", height: "100%" }}
                    ></Map>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Ultra Light</h4>
                  <p className="card-title-desc">Example of google maps.</p>
                </CardHeader>
                <CardBody>
                  <div
                    id="gmaps-overlay"
                    className="gmaps"
                    style={{ position: "relative" }}
                  >
                    {/* <Map
                      google={props.google}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Marker
                        onClick={() => {
                          onMarkerClick();
                        }}
                      />
                    </Map> */}
                    <Map
                      google={props.google}
                      style={{ width: "100%", height: "100%" }}
                    ></Map>{" "}
                    <Marker
                      onClick={() => {
                        onMarkerClick();
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

MapsGoogle.propTypes = {
  google: PropTypes.object,
};

export default connect(
  null,
  {}
)(
  GoogleApiWrapper({
    apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
    LoadingContainer: LoadingContainer,
  })(MapsGoogle)
);
