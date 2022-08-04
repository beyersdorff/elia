import React, { Component, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// components
import Cart from './cart';
import LogOutModal from './logOutModal'

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';

// assets
import logo from '../../assets/images/logo.svg';
import userIcon from '../../assets/icons/user-white.svg';

//Context
import { useUser, useUserUpdate } from '../../contexts/user';

const Header = () => {
  const user = useUser()
  const setUser = useUserUpdate()
  const [show, setModalShow] = useState(false);

  const logOut = () => {
    setModalShow(true);
    setUser({});
  }

  return (
    <div>
      <Container>
        <Row className="header align-items-center">
          <Col xs={6}>
            <Row>
              <Col className="col-auto">
                <Link to="/">
                  <img src={logo} className="header__logo" alt="Elia" />
                </Link>
              </Col>
              <Col className="col-auto">
                <div className="header__slogan">
                  Uncompromisingly good
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <Row className="justify-content-end">
              <Col className="col-auto">
                <Cart />
              </Col>
              <Col className="col-auto ps-0">
                <Dropdown>
                  <Dropdown.Toggle>
                    <img className="me-1" style={{marginTop: '-2px'}} src={userIcon} width="20" height="20" alt="User Icon" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <Dropdown.Item href="/dashboard">{user.token ? "MyElia" : "Log In"}</Dropdown.Item>
                  {user.token && <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="header__border"></div>
        <Outlet></Outlet>
      </Container>
      <LogOutModal show={show} setModalShow={setModalShow}/>
    </div>
  )
}
export default Header;
