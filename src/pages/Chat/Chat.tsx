import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { isEmpty, map } from "lodash";
import moment from "moment";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from "reactstrap";

import classnames from "classnames";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import * as images from "../../assets/images/index";
import {
  addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  getMessages as onGetMessages,
} from "../../store/actions";

// import image
import image from "../../assets/images/users/user-dummy-img.jpg"

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

interface CurrentUserTypes {
  name: string;
  isActive: boolean;
}
const Chat = () => {
  document.title = "Chat | Minia - React Admin & Dashboard Template";
  const dispatch = useDispatch();

  const chatData = createSelector(

    (state: any) => state.Chat,
    (state) => ({
      chats: state.chats,
      groups: state.groups,
      contacts: state.contacts,
      messages: state.messages,
    })
  );
  // Inside your component
  const { chats, groups, contacts, messages } = useSelector(chatData);


  const [messageBox, setMessageBox] = useState<any>(null);
  const [currentRoomId, setCurrentRoomId] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<CurrentUserTypes>({
    name: "Henry Wells",
    isActive: true,
  });
  const [menu1, setMenu1] = useState<boolean>(false);
  const [search_Menu, setsearch_Menu] = useState<boolean>(false);
  const [settings_Menu, setsettings_Menu] = useState<boolean>(false);
  const [other_Menu, setother_Menu] = useState<boolean>(false);
  const [activeTab, setactiveTab] = useState<string>("1");
  const [Chat_Box_Username, setChat_Box_Username] =
    useState<string>("Steven Franklin");
  const [Chat_Box_User_Status, setChat_Box_User_Status] =
    useState<string>("online");
  const [curMessage, setcurMessage] = useState<string>("");
  const [Chat_Box_Image, setChat_Box_Image] = useState<any>(images.avatar1);

  useEffect(() => {
    dispatch(onGetChats());
    dispatch(onGetGroups());
    dispatch(onGetContacts());
    dispatch(onGetMessages(currentRoomId));
  }, [dispatch, currentRoomId]);

  const scrollToBottom = useCallback(() => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000;
    }
  }, [messageBox]);

  useEffect(() => {
    if (!isEmpty(messages)) scrollToBottom();
  }, [messages, scrollToBottom]);

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };

  const toggleOther = () => {
    setother_Menu(!other_Menu);
  };

  const toggleTab = (tab: any) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  //Use For Chat Box
  const userChatOpen = (roomId: any, name: string, id: any, status: any, image: any) => {
    setChat_Box_Username(name);
    setChat_Box_Image(image)
    setCurrentRoomId(roomId);
    dispatch(onGetMessages(roomId));
  };

  const addMessage = (roomId: number, sender: string) => {
    const message: any = {
      id: Math.floor(Math.random() * 100),
      roomId,
      sender,
      message: curMessage,
      createdAt: new Date(),
    };
    setcurMessage("");
    dispatch(onAddMessage(message));
  };

  const onKeyPress = (e: any) => {
    const { key, value } = e;
    if (key === "Enter") {
      setcurMessage(value);
      addMessage(currentRoomId, currentUser.name);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Apps" breadcrumbItem="Chat" />

          <div className="d-lg-flex">
            <Card className="chat-leftsidebar">
              <div className="p-3 px-4 border-bottom">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3 align-self-center">
                    <img
                      src={images.avatar1}
                      className="avatar-sm rounded-circle"
                      alt=""
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="font-size-16 mt-0 mb-1">
                      <Link to="#" className="text-dark">
                        {currentUser.name}
                        <i className="mdi mdi-circle text-success align-middle font-size-10 ms-1" />
                      </Link>
                    </h5>
                    <p className="text-muted mb-0">
                      Available
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Dropdown
                      isOpen={menu1}
                      toggle={() => setMenu1(!menu1)}
                      className="chat-noti-dropdown"
                    >
                      <DropdownToggle tag="i" className="text-muted">
                        <i className="mdi mdi-dots-horizontal font-size-20"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem to="#">Profile</DropdownItem>
                        <DropdownItem to="#">Edit</DropdownItem>
                        <DropdownItem to="#">Add Contact</DropdownItem>
                        <DropdownItem to="#">Setting</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="search-box position-relative">
                  <input
                    type="text"
                    className="form-control rounded border"
                    placeholder="Search..."
                  />
                  <i className="bx bx-search search-icon"></i>
                </div>
              </div>

              <div className="chat-leftsidebar-nav">
                <Nav
                  pills
                  justified
                  className="bg-soft-light p-1 nav nav-pills nav-justified bg-light-subtle p-1"
                >
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "1",
                      })}
                      onClick={() => {
                        toggleTab("1");
                      }}
                    >
                      <i className="bx bx-chat font-size-20 d-sm-none" />
                      <span className="d-none d-sm-block">Chat</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "2",
                      })}
                      onClick={() => {
                        toggleTab("2");
                      }}
                    >
                      <i className="bx bx-group font-size-20 d-sm-none" />
                      <span className="d-none d-sm-block">Groups</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "3",
                      })}
                      onClick={() => {
                        toggleTab("3");
                      }}
                    >
                      <i className="bx bx-book-content font-size-20 d-sm-none" />
                      <span className="d-none d-sm-block">Contacts</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <PerfectScrollbar style={{ height: "530px" }}>
                      <div className="pt-3">
                        <div className="px-3">
                          <h5 className="font-size-14 mb-3">Recent</h5>
                        </div>
                        <ul className="list-unstyled chat-list">
                          {map(chats, (chat) => (
                            <li
                              key={chat.id + chat.status}
                              className={
                                currentRoomId === chat.roomId ? "active" : ""
                              }
                            >
                              <Link
                                to="#"
                                onClick={() => {
                                  userChatOpen(
                                    chat.roomId,
                                    chat.name,
                                    chat.id,
                                    chat.status,
                                    chat.image
                                  );
                                }}
                              >
                                <div className="d-flex align-items-start">
                                  <div
                                    className={
                                      chat.status === "online"
                                        ? "flex-shrink-0 user-img online align-self-center me-3"
                                        : chat.status === "intermediate"
                                          ? "flex-shrink-0 user-img away align-self-center me-3"
                                          : "flex-shrink-0 user-img align-self-center me-3"
                                    }
                                  >
                                    <img
                                      src={chat.image}
                                      className="rounded-circle avatar-sm"
                                      alt=""
                                    />
                                    <span className="user-status"></span>
                                  </div>

                                  <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="text-truncate font-size-14 mb-1">
                                      {chat.name}
                                    </h5>
                                    <p className="text-truncate mb-0">
                                      {chat.description}
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <div className="font-size-11">
                                      {chat.time}
                                    </div>
                                  </div>
                                  {chat.unreadmsg && (
                                    <div className="unread-message">
                                      <span className="badge bg-danger rounded-pill">
                                        {chat.unreadmsg}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </TabPane>

                  <TabPane tabId="2">
                    <PerfectScrollbar
                      className="chat-message-list"
                      style={{ height: "530px" }}
                    >
                      <div className="pt-3">
                        <div className="px-3">
                          <h5 className="font-size-14 mb-3">Groups</h5>
                        </div>
                        <ul className="list-unstyled chat-list">
                          {groups &&
                            groups.map((group: any) => (
                              <li key={"test" + group.image}>
                                <Link
                                  to="#"
                                  onClick={() => {
                                    userChatOpen(
                                      group.id,
                                      group.name,
                                      Math.floor(Math.random() * 100),
                                      group.status,
                                      group.images
                                    );
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 avatar-sm me-3">
                                      <span className="avatar-title rounded-circle  bg-primary-subtle text-primary">
                                        {group.image}
                                      </span>
                                    </div>

                                    <div className="flex-grow-1">
                                      <h5 className="font-size-14 mb-0">
                                        {group.name}
                                      </h5>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </TabPane>

                  <TabPane tabId="3">
                    <PerfectScrollbar
                      className="chat-message-list"
                      style={{ height: "530px" }}
                    >
                      <div className="pt-3">
                        <div className="px-3">
                          <h5 className="font-size-14 mb-3">Contacts</h5>
                        </div>

                        <div>
                          {contacts &&
                            contacts.map((contact: any) => (
                              <div
                                key={"test_" + contact.category}
                                className={
                                  contact.category === "A" ? "" : "mt-4"
                                }
                              >
                                <div>
                                  <span className="px-3 contact-list">
                                    {contact.category}
                                  </span>
                                </div>

                                <ul className="list-unstyled chat-list">
                                  {contact.child.map((array: any) => (
                                    <li key={"test" + array.id}>
                                      <Link
                                        to="#"
                                        onClick={() => {
                                          userChatOpen(
                                            array.id,
                                            array.name,
                                            Math.floor(Math.random() * 100),
                                            array.status,
                                            array.image
                                          );
                                        }}
                                      >
                                        <h5 className="font-size-14 mb-0">
                                          {array.name}
                                        </h5>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </TabPane>
                </TabContent>
              </div>
            </Card>
            <div className="w-100 user-chat mt-4 mt-sm-0 ms-lg-1">
              <Card>
                <div className="p-3 px-lg-4 border-bottom">
                  <Row>
                    <Col md="4" xs="9">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 avatar-sm me-3 d-sm-block d-none">
                          <img
                            src={Chat_Box_Image ? Chat_Box_Image : image}
                            className="img-fluid d-block rounded-circle"
                            alt=""
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="font-size-14 mb-1 text-truncate">
                            <Link to="#" className="text-dark">
                              {Chat_Box_Username}
                            </Link>
                          </h5>

                          <p className="text-muted mb-0 text-truncate">
                            <i
                              className={
                                Chat_Box_User_Status === "online"
                                  ? "mdi mdi-circle text-success align-middle me-1"
                                  : Chat_Box_User_Status === "intermediate"
                                    ? "mdi mdi-circle text-warning align-middle me-1"
                                    : "mdi mdi-circle align-middle me-1"
                              }
                            />
                            {Chat_Box_User_Status}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md="8" xs="3">
                      <ul className="list-inline user-chat-nav text-end mb-0">
                        <li className="list-inline-item d-none d-sm-inline-block">
                          <Dropdown isOpen={search_Menu} toggle={toggleSearch}>
                            <DropdownToggle className="btn nav-btn" tag="i">
                              <i className="bx bx-search" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-md dropdown-menu-end">
                              <Form className="p-3">
                                <FormGroup className="m-0">
                                  <InputGroup>
                                    <Input
                                      type="text"
                                      className="form-control border bg-light-subtle"
                                      placeholder="Search ..."
                                      aria-label="Recipient's username"
                                    />
                                    <Button color="primary" type="submit">
                                      <i className="mdi mdi-magnify" />
                                    </Button>
                                  </InputGroup>
                                </FormGroup>
                              </Form>
                            </DropdownMenu>
                          </Dropdown>
                        </li>
                        <li className="list-inline-item  d-none d-sm-inline-block">
                          <Dropdown
                            isOpen={settings_Menu}
                            toggle={toggleSettings}
                          >
                            <DropdownToggle className="btn nav-btn" tag="i">
                              <i className="bx bx-cog" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem href="#">View Profile</DropdownItem>
                              <DropdownItem href="#">Clear chat</DropdownItem>
                              <DropdownItem href="#">Muted</DropdownItem>
                              <DropdownItem href="#">Delete</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </li>
                        <li className="list-inline-item">
                          <Dropdown isOpen={other_Menu} toggle={toggleOther}>
                            <DropdownToggle className="btn nav-btn" tag="i">
                              <i className="bx bx-dots-horizontal-rounded" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem href="#">Action</DropdownItem>
                              <DropdownItem href="#">Profile</DropdownItem>
                              <DropdownItem href="#">Archived</DropdownItem>
                              <DropdownItem href="#">Muted</DropdownItem>
                              <DropdownItem href="#">Delete</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </div>

                <div>
                  <PerfectScrollbar
                    className="chat-conversation p-3 px-2"
                    style={{ height: "600px" }}
                    containerRef={(ref) => setMessageBox(ref)}
                  >
                    <ul className="list-unstyled">
                      <li>
                        <div className="chat-day-title">
                          <span className="title">Today</span>
                        </div>
                      </li>
                      {messages &&
                        map(messages, (message) => (
                          <li
                            key={"test_k" + message.id}
                            className={
                              message.sender === currentUser.name ? "right" : ""
                            }
                          >
                            <div className="conversation-list">
                              <div className="ctext-wrap">
                                <div className="ctext-wrap-content">
                                  <h5 className="conversation-name">
                                    <Link to="#" className="user-name">
                                      {message.sender}
                                    </Link>
                                    <span className="time">
                                      {moment(message.createdAt).format(
                                        "DD-MM-YY hh:mm"
                                      )}
                                    </span>
                                  </h5>
                                  <p className="mb-0">{message.message}</p>
                                </div>

                                <UncontrolledDropdown className="align-self-start">
                                  <DropdownToggle
                                    href="#"
                                    className="btn nav-btn"
                                    tag="i"
                                  >
                                    <i className="bx bx-dots-vertical-rounded" />
                                  </DropdownToggle>
                                  <DropdownMenu direction="right">
                                    <DropdownItem href="#">Copy</DropdownItem>
                                    <DropdownItem href="#">Save</DropdownItem>
                                    <DropdownItem href="#">
                                      Forward
                                    </DropdownItem>
                                    <DropdownItem href="#">Delete</DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </PerfectScrollbar>
                  <div className="p-3 border-top">
                    <Row>
                      <Col>
                        <div className="position-relative">
                          <input
                            type="text"
                            value={curMessage}
                            onKeyPress={onKeyPress}
                            onChange={(e) => setcurMessage(e.target.value)}
                            className="form-control border bg-light-subtle"
                            placeholder="Enter Message..."
                          />
                        </div>
                      </Col>
                      <Col className="col-auto">
                        <Button
                          type="button"
                          color="primary"
                          onClick={() =>
                            addMessage(currentRoomId, currentUser.name)
                          }
                          className="btn btn-primary chat-send w-md"
                        >
                          <span className="d-none d-sm-inline-block me-2">
                            Send
                          </span>{" "}
                          <i className="mdi mdi-send float-end" />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Chat;
