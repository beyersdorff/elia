import React, {  useState } from 'react';

// assets
import logo from '../../assets/images/logo.svg';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Components
import { LogInForm } from '../shared/login';
import { RegisterForm } from '../shared/register';

//function
const DashboardLogIn = () => {

  const [showRegistration, setShowRegistration] = useState(false);
  const [userType, setUserType] = useState("customer");

  const toggleFormType = () => {
    setShowRegistration(!showRegistration);
  }

  const form = showRegistration ?
      <RegisterForm destination="/dashboard" toggleFunction={toggleFormType}/> :
      <LogInForm showRegistration={showRegistration} userType={userType} setUserType={setUserType} toggleFunction={toggleFormType} destination="/dashboard"/>

    return (
        <div className="dashboard">
          <Container fluid className="dashboard__login p-0">
            <Row className="align-items-center">
              <Col md={5} className="vh-100 d-none d-md-block">
                <div className="dashboard__background vh-100"></div>
              </Col>
              <Col className="justify-content-center py-5">
                <img className="dashboard__login-logo d-block mb-5 mx-auto" src={logo} alt="Elia" />
                {form}
              </Col>
            </Row>
          </Container>
        </div>
      )
  }

export default DashboardLogIn;