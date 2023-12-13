import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Container,
  CardHeader,
} from "reactstrap";

//Lightbox
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

// import image
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img7 from "../../assets/images/small/img-7.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const images : Array<any> = [img1, img2, img3, img4, img5, img6];
const imageZoom : Array<any> = [img3, img7];

const UiLightbox = () => {
  document.title = "Lightbox | Minia - React Admin & Dashboard Template";

  const [photoIndex, setphotoIndex] = useState<any>(0);
  const [isFits, setisFits] = useState<boolean>(false);
  const [isEffects, setisEffects] = useState<boolean>(false);
  const [isGallery, setisGallery] = useState<boolean>(false);
  const [isGalleryZoom, setisGalleryZoom] = useState(false);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [isOpen1, setisOpen1] = useState<boolean>(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Extended" breadcrumbItem="Lightbox" />

          {isFits ? (
            <Lightbox
              mainSrc={images[photoIndex]}
              enableZoom={false}
              imageCaption={
                "Caption. Can be aligned it to any side and contain any HTML."
              }
              onCloseRequest={() => {
                setisFits(!isFits);
              }}
            />
          ) : null}

          {isEffects ? (
            <Lightbox
              mainSrc={images[1]}
              enableZoom={false}
              onCloseRequest={() => {
                setisEffects(!isEffects);
              }}
            />
          ) : null}

          {isGallery ? (
            <Lightbox
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}
              enableZoom={true}
              onCloseRequest={() => {
                setisGallery(false);
              }}
              onMovePrevRequest={() => {
                setphotoIndex((photoIndex + images.length - 1) % images.length);
              }}
              onMoveNextRequest={() => {
                setphotoIndex((photoIndex + 1) % images.length);
              }}
              imageCaption={"Project " + parseFloat(photoIndex + 1)}
            />
          ) : null}

          {isGalleryZoom ? (
            <Lightbox
              mainSrc={imageZoom[photoIndex]}
              nextSrc={imageZoom[(photoIndex + 1) % imageZoom.length]}
              prevSrc={
                imageZoom[
                  (photoIndex + imageZoom.length - 1) % imageZoom.length
                ]
              }
              onCloseRequest={() => {
                setisGalleryZoom(false);
              }}
              onMovePrevRequest={() => {
                setphotoIndex(
                  (photoIndex + imageZoom.length - 1) % imageZoom.length
                );
              }}
              onMoveNextRequest={() => {
                setphotoIndex((photoIndex + 1) % imageZoom.length);
              }}
            />
          ) : null}

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Single Image Lightbox</h5>
                  <p className="card-title-desc">
                    Glightbox Single Image Lightbox Example
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          onClick={() => {
                            setisFits(true);
                          }}
                          className="img-fluid"
                          alt="Minia"
                          src={img1}
                        />
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          onClick={() => {
                            setisEffects(true);
                          }}
                          className="img-fluid"
                          alt=""
                          src={img2}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Images with Description</h5>
                  <p className="card-title-desc">
                    Glightbox Images with Description Example.{" "}
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          src={img4}
                          onClick={() => {
                            setisGallery(true);
                            setphotoIndex(3);
                          }}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          src={img5}
                          onClick={() => {
                            setisGallery(true);
                            setphotoIndex(4);
                          }}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          src={img1}
                          onClick={() => {
                            setisGallery(true);
                            setphotoIndex(0);
                          }}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Popup with Video or Map</h5>
                  <p className="card-title-desc">
                    Glightbox Popup with Video or Map Example.{" "}
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div className="d-flex align-items-start gap-3 flex">
                      <Button
                        className="btn btn-light image-popup-video-map"
                        onClick={() => {
                          setisOpen(!isOpen);
                        }}
                      >
                        Open YouTube Video
                      </Button>{" "}
                      <Button
                        className="btn btn-light image-popup-video-map"
                        onClick={() => {
                          setisOpen1(!isOpen1);
                        }}
                      >
                        Open Vimeo Video
                      </Button>{" "}
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen}
                        onClose={() => {
                          setisOpen(!isOpen);
                        }}
                      />
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen1}
                        onClose={() => {
                          setisOpen1(false);
                        }}
                      />
                    </div>
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

export default UiLightbox;
