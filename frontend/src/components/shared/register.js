import React, { useState } from 'react';

// service
import ApiService from '../../services/Api.service'

// bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Context
import { useUser, useUserUpdate } from '../../contexts/user';

import { useNavigate } from 'react-router-dom';

export const RegisterForm = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrongCredentialsMessage, setWrongCredentialsMessage] = useState("");
    const [requestPending, setRequestPending] = useState(false);

    // Validation
    const [validated, setValidated] = useState(false);

    //Context
    const setUser = useUserUpdate()
    const user = useUser();

    const navigate = useNavigate()

    const register = (event) => {
      const form = event.currentTarget;
      event.preventDefault();

      if (form.checkValidity() === false) {
          event.stopPropagation();
      } else {
        setRequestPending(true)
        ApiService.httpPost(`customer`, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
        .then(res => {
          if (res.data.success){
            setUser({
              token: res.data.token,
              role: "customer",
              ...res.data.user
            })
          }
          else {
            setWrongCredentialsMessage(`Wrong username/password`);
          }
        })
        .catch(err => {
          console.error(err)
          setWrongCredentialsMessage(`Registration error: ${err}`);
        })
        .finally(() => {
          setRequestPending(false)
        })
      }
      setValidated(true);
    }

    if (user.token && props.destination) {
      return (
        navigate(props.destination)
      )
    }

    return (
        <div className="user__register-form">
            <h3>Register</h3>
            <Form className="mt-4" noValidate validated={validated} onSubmit={register} >
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control required type="text" disabled={requestPending} value={firstName} onChange={event => setFirstName(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide your first name!</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control required type="text" disabled={requestPending} value={lastName} onChange={event => setLastName(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide your last name!</Form.Control.Feedback>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mt-2 mb-4">
                <Row>
                    <Col>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" disabled={requestPending} value={email} onChange={event => setEmail(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide a valid email address!</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" disabled={requestPending} value={password} onChange={event => setPassword(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide a password!</Form.Control.Feedback>
                    </Col>
                </Row>

            </Form.Group>
            <Button type="submit" className="d-block w-100" variant="primary" disabled={requestPending}>
                Register
            </Button>
            <div className="mt-4 text-danger">
                {wrongCredentialsMessage !== "" && <p>{wrongCredentialsMessage}</p>}
            </div>
            </Form>
            <div>
                Already registered?
                <a className="ms-1" href="#" onClick={props.toggleFunction}>Sign in</a>
            </div>
        </div>
    )
}