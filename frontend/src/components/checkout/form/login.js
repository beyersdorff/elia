import React, { Component, useState } from 'react';

// assets
import logo from '../../../assets/images/logo.svg';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Components
import { LogInForm } from '../../shared/login';
import { RegisterForm } from '../../shared/register';

const Login = (props) => {
  const [showRegistration, setShowRegistration] = useState(false);

  const toggleFormType = () => {
    setShowRegistration(!showRegistration);
  }

  const form = showRegistration ?
      <RegisterForm toggleFunction={toggleFormType}/> :
      <LogInForm userType="customer" onlyCustomer toggleFunction={toggleFormType}/>

    return (
        <div>
          <Container fluid>
            <Row className="align-items-center">
                <Col className="justify-content-center py-5">
                  {form}
                </Col>
            </Row>
          </Container>
        </div>
      )
  }

export default Login;