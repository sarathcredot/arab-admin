import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

/** Import Full Calendar  */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";

//import images
import calendar from "../../assets/images/undraw-calendar.svg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  getCategories as onGetCategories,
  getEvents as onGetEvents,
  updateEvent as onUpdateEvent,
  resetCalendar as onResetCalendar,
} from "../../store/actions";

import DeleteModal from "./DeleteModal";

//css
// import "@fullcalendar/bootstrap/main.css";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

interface CalendarProps {
  className: string;
}
const Calender = ({ className }: CalendarProps) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [modalcategory, setModalcategory] = useState<boolean>(false);
  const [event, setEvent] = useState<any>({});
  const [selectedDay, setSelectedDay] = useState<any>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // events validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || "",
      category: (event && event.category) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please provide a valid event name"),
      category: Yup.string().required("Please provide a Category"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateEvent = {
          id: event.id,
          title: values.title,
          classNames: values.category + " text-white",
          start: event.start,
        };
        // update event
        dispatch(onUpdateEvent(updateEvent));
        validation.resetForm();
      } else {
        const newEvent = {
          id: Math.floor(Math.random() * 100),
          title: values["title"],
          start: selectedDay ? selectedDay.date : new Date(),
          className: values.category + " text-white",
        };
        // save new event
        dispatch(onAddNewEvent(newEvent));
        validation.resetForm();
      }
      setSelectedDay(null);
      toggle();
    },
  });

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEvent(null);
    } else {
      setModal(true);
    }
  };

  const toggleCategory = () => {
    setModalcategory(!modalcategory);
  };

  // category validation
  const categoryValidation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || "",
      category: (event && event.category) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please provide a valid event name"),
      category: Yup.string().required("Please provide a Category"),
    }),
    onSubmit: (values) => {
      const newEvent = {
        id: Math.floor(Math.random() * 100),
        title: values["title"],
        start: selectedDay ? selectedDay.date : new Date(),
        className: values.category + " text-white",
      };
      dispatch(onAddNewEvent(newEvent));

      toggleCategory();
    },
  });

  const calendarData = createSelector(

    (state: any) => state.Calendar,
    (state) => ({
      events: state.events,
      categories: state.categories,
      isEventUpdated: state.isEventUpdated,
    })
  );
  // Inside your component
  const { events, categories, isEventUpdated } = useSelector(calendarData);

  useEffect(() => {
    let external: any = document.getElementById("external-events");
    dispatch(onGetCategories());
    dispatch(onGetEvents());
    new Draggable(external, {
      itemSelector: ".external-event",
    });
  }, [dispatch]);

  /**
   * Handling the modal state
   */
  useEffect(() => {
    if (isEventUpdated) {
      setIsEdit(false);
      setEvent({});
      setTimeout(() => {
        dispatch(onResetCalendar("isEventUpdated", false));
      }, 500);
    }
  }, [dispatch, isEventUpdated]);

  /**
   * Handling date click on calendar
   */
  const handleDateClick = (arg: any) => {
    const date = arg["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );
    const modifiedData = { ...arg, date: modifiedDate };

    setSelectedDay(modifiedData);
    toggle();
  };

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg: any) => {
    const event = arg.event;
    setEvent({
      id: event.id,
      title: event.title,
      title_category: event.title_category,
      start: event.start,
      className: event.classNames,
      category: event.classNames[0],
      event_category: event.classNames[0],
    });
    setIsEdit(true);
    toggle();
  };

  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    dispatch(onDeleteEvent(event.id));
    setDeleteModal(false);
    toggle();
  };

  /**
   * On category darg event
   */
  const onDrag = (event: any) => {
    event.preventDefault();
  };

  /**
   * On calendar drop event
   */
  const onDrop = (event: any) => {
    const date = event["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const draggedEl = event.draggedEl;
    const draggedElclass = draggedEl.className;
    if (
      draggedEl.classList.contains("external-event") &&
      draggedElclass.indexOf("fc-event-draggable") == -1
    ) {
      const modifiedData = {
        id: Math.floor(Math.random() * 100),
        title: draggedEl.innerText,
        start: modifiedDate,
        className: draggedEl.className,
      };
      dispatch(onAddNewEvent(modifiedData));
    }
  };
  document.title = "Calendar | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Apps" breadcrumbItem="Calendar" />
          <Row>
            <Col xs={12}>
              <Row>
                <Col xl={3} lg={4}>
                  <Card>
                    <CardBody>
                      <div className="d-grid">
                        <Button
                          color="primary"
                          className="font-16 btn-primary"
                          onClick={toggleCategory}
                        >
                          <i className="mdi mdi-plus-circle-outline me-1" />
                          Create New Event
                        </Button>
                      </div>
                      <div id="external-events" className="mt-2">
                        <br />
                        <p className="text-muted">
                          Drag and drop your event or click in the calendar
                        </p>
                        {categories &&
                          categories.map((category: any, i: any) => (
                            <div
                              className={`${category.type + " " + category.text
                                } fc-event external-event`}
                              key={"cat-" + category.id}
                              draggable
                              onDrag={(event) => onDrag(event)}
                            >
                              <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                              {category.title}
                            </div>
                          ))}
                      </div>
                      <div className="row justify-content-center mt-5">
                        <div className="col-lg-12 col-sm-6">
                          <img
                            src={calendar}
                            alt=""
                            className="img-fluid d-block"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={9} lg={8}>
                  <Card>
                    <CardBody>
                      {/* fullcalendar control */}
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          interactionPlugin,
                        ]}
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,dayGridWeek,dayGridDay",
                        }}
                        events={events}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        drop={onDrop}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <div style={{ clear: "both" }}></div>
              {/* New/Edit event modal */}
              <Modal isOpen={modal} className={className}>
                <ModalHeader toggle={toggle} tag="h4">
                  {!!isEdit ? "Edit Event" : "Add Event"}
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col className="col-12 mb-3">
                        <Label className="form-label">Event Name</Label>
                        <Input
                          name="title"
                          type="text"
                          placeholder="Insert Ecent Name"
                          // value={event ? event.title : ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.title || ""}
                          invalid={
                            validation.touched.title && validation.errors.title
                              ? true
                              : false
                          }
                        />
                        {validation.touched.title && validation.errors.title ? (
                          <FormFeedback type="invalid">
                            {validation.errors.title}
                          </FormFeedback>
                        ) : null}
                      </Col>
                      <Col className="col-12 mb-3">
                        <Label className="form-label">Select Category</Label>
                        <Input
                          type="select"
                          name="category"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.category || ""}
                          invalid={
                            validation.touched.category &&
                              validation.errors.category
                              ? true
                              : false
                          }
                        >
                          <option value="bg-danger">Danger</option>
                          <option value="bg-success">Success</option>
                          <option value="bg-primary">Primary</option>
                          <option value="bg-info">Info</option>
                          <option value="bg-dark">Dark</option>
                          <option value="bg-warning">Warning</option>
                        </Input>
                        {validation.touched.category &&
                          validation.errors.category ? (
                          <FormFeedback type="invalid">
                            {validation.errors.category}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div>
                          {!!isEdit && (
                            <button
                              type="button"
                              className="btn btn-danger me-2"
                              onClick={() => setDeleteModal(true)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="text-end">
                          <button
                            type="button"
                            className="btn btn-light me-2"
                            onClick={toggle}
                          >
                            Close
                          </button>

                          <button
                            type="submit"
                            className="btn btn-success save-event"
                          >
                            Save
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </ModalBody>
              </Modal>

              <Modal
                isOpen={modalcategory}
                toggle={toggleCategory}
                className={className}
              >
                <ModalHeader toggle={toggleCategory} tag="h4">
                  Add a Event
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      categoryValidation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row form>
                      <Col className="col-12 mb-3">
                        <Label className="form-label">Event Name</Label>
                        <Input
                          name="title"
                          type="text"
                          placeholder="Insert Event Name"
                          onChange={categoryValidation.handleChange}
                          onBlur={categoryValidation.handleBlur}
                          value={categoryValidation.values.title || ""}
                          invalid={
                            categoryValidation.touched.title &&
                              categoryValidation.errors.title
                              ? true
                              : false
                          }
                        />
                        {categoryValidation.touched.title &&
                          categoryValidation.errors.title ? (
                          <FormFeedback type="invalid">
                            {categoryValidation.errors.title}
                          </FormFeedback>
                        ) : null}
                      </Col>
                      <Col className="col-12 mb-3">
                        <Label className="form-label">Select Category</Label>
                        <Input
                          type="select"
                          name="category"
                          onChange={categoryValidation.handleChange}
                          onBlur={categoryValidation.handleBlur}
                          value={categoryValidation.values.category || ""}
                          invalid={
                            categoryValidation.touched.category &&
                              categoryValidation.errors.category
                              ? true
                              : false
                          }
                        >
                          <option value="bg-danger">Danger</option>
                          <option value="bg-success">Success</option>
                          <option value="bg-primary">Primary</option>
                          <option value="bg-info">Info</option>
                          <option value="bg-dark">Dark</option>
                          <option value="bg-warning">Warning</option>
                        </Input>
                        {categoryValidation.touched.category &&
                          categoryValidation.errors.category ? (
                          <FormFeedback type="invalid">
                            {categoryValidation.errors.category}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="text-end">
                          <button
                            type="button"
                            className="btn btn-light me-2"
                            onClick={toggleCategory}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success save-event"
                          >
                            Save
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Calender;
