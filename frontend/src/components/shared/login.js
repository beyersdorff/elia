import React, { useState } from 'react';

// service
import ApiService from '../../services/Api.service'

// bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Context
import { useUser, useUserUpdate } from '../../contexts/user';
import { Navigate, useNavigate } from 'react-router-dom';

export const LogInForm = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [wrongCredentialsMessage, setWrongCredentialsMessage] = useState("");
    const [requestPending, setRequestPending] = useState(false);

    // Validation
    const [validated, setValidated] = useState(false);

    //Context
    const setUser = useUserUpdate()
    const user = useUser();

    const navigate = useNavigate()

    const logIn = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      if (form.checkValidity() === false) {
          event.stopPropagation();
      } else {
        setRequestPending(true)
        ApiService.httpPost(`${props.userType}/login`, {
          username: username,
          password: password
        })
        .then(res => {
          if (res.data.success){
            setUser({
              token: res.data.token,
              role: props.userType,
              ...res.data.user
            })
          }
          else {
            setWrongCredentialsMessage(`Wronge username/password`);
          }
        })
        .catch(err => {
          console.error(err)
          setWrongCredentialsMessage(`Login error: ${err}`);
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
      <div>
        <div className="user__login-form mb-2">
            <h3>Login</h3>
            <Form className="mt-4" noValidate validated={validated} onSubmit={logIn} >
            <Form.Group>
                <Form.Label>{props.userType !== "admin" ? "E-Mail" : "Username"}</Form.Label>
                <Form.Control required type={props.userType !== "admin" ? "email" : "text"} disabled={requestPending} value={username} onChange={event => setUsername(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide a valid {props.userType !== "admin" ? "email address" : "username"}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mt-2 mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control required type="password" disabled={requestPending} value={password} onChange={event => setPassword(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide a password!</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="d-block w-100" variant="primary" disabled={requestPending}>
                Log in
            </Button>
            <div className="mt-4 text-danger">
                {wrongCredentialsMessage !== "" && <p>{wrongCredentialsMessage}</p>}
            </div>
            </Form>
            {props.userType === "customer" &&
            <div>
                Not register yet?
                <a className="ms-1" href="#" onClick={props.toggleFunction}>Register now</a>
            </div>}
        </div>
        {!props.onlyCustomer &&
          <div className="text-center">
            {props.userType !== "farmer" && <span><a href='#' onClick={() => props.setUserType("farmer")}>Sign in as Farmer</a> | </span>}
            {props.userType !== "admin" && <span><a href='#' onClick={() => props.setUserType("admin")}>Sign in as Admin</a> | </span>}
            {props.userType !== "customer" && <span><a href='#' onClick={() => props.setUserType("customer")}>Sign in as customer</a></span>}
          </div>
        }
      </div>
    )
}