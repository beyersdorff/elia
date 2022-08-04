import React, {useEffect, useState} from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

// components
import Cart from '../shared/cart';
import LogOutModal from '../shared/logOutModal';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// assets
import logo from '../../assets/images/logo.svg';

//Context
import { useUser, useUserUpdate } from '../../contexts/user';

const DashboardHeader = () => {
  const user = useUser()
  const setUser = useUserUpdate()
  const navigate = useNavigate();
  const [show, setModalShow] = useState(false);


  const logOut = () => {
    setUser({});
    setModalShow(true);
    navigate('/');
  }

  if (!user.token)
      return <Navigate to='/login' replace />;


  return (
    <div>
      <Container>
        <Row className="header align-items-center">
          <Col xs={6}>
            <Row className="align-items-end">
              <Col className="col-auto">
                <a href="/">
                  <img src={logo} className="header__logo" alt="Elia" />
                </a>
              </Col>
              <Col className="col-auto ps-0">
                <h5 className="opacity-25 m-0">MyELIA</h5>
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <Row className="justify-content-end">
              <Col className="col-auto">
                <Cart />
              </Col>
              <Col className="col-auto ps-0">
                <Button onClick={logOut}>Logout</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="header__border"></div>
      </Container>
      <Outlet />
    </div>
  )
}
export default DashboardHeader;
