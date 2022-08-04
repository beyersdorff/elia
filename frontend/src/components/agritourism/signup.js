import React, { Component, useState, useEffect } from 'react';

//Date Picker
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";

// bootstrap components
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// service
import ApiService from '../../services/Api.service'

// Language
import moment from "moment";
import 'moment/locale/en-nz'

//Context
import { useUser } from '../../contexts/user';

const AgritourismSignUp = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [focusedInput, setFocusedInput] = useState();
    const [numberPeople, setNumberPeople] = useState("");
    const [numberRooms, setNumberRooms] = useState("");
    const [introText, setIntroText] = useState("");
    const [invalidFormMessage, setInvalidFormMessage] = useState("");
    const [requestPending, setRequestPending] = useState(false);
    const [requestId, setRequestId] = useState("");
    const [show, setModalShow] = useState(false);
    const [checked, setChecked] = useState(false);

    // Validation
    const [validated, setValidated] = useState(false);

    // Context
    const user = useUser()

    useEffect(() => {
        if (user.role && user.role == "customer") {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
        }
    }, []);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setRequestPending(true);

            ApiService.httpPost(`farmer/agritourism/${props.farmer._id}`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                startDate: startDate,
                endDate: endDate,
                numberPeople: numberPeople,
                numberRooms: numberRooms,
                introText: introText
            })
            .then(res => {
                if (res.data.success){
                    setModalShow(true);
                    setRequestId(res.data.id);
                    if (!user.token) {
                        setFirstName("");
                        setLastName("");
                        setEmail("");
                    }
                    setStartDate();
                    setEndDate();
                    setIntroText("");
                    setInvalidFormMessage("");
                    setNumberPeople("");
                    setNumberRooms("");
                    setValidated(false)
                    setChecked(false);
                }
                else {
                    setInvalidFormMessage(`Ungültiges Formular: ${res.data.message}`);
                }
            })
            .catch(err => {
                console.error(err)
                setInvalidFormMessage(`Fehler bei der Anmeldung: ${err}`);
            })
            .finally(() => {
                setRequestPending(false)
            })
        }

        setValidated(true);
    }

    const isDayBlocked = (date) => {
        var blocked = false;
        var currentStartDate;
        var currentEndDate;

        props.farmer.tourism.bookingRequests.every((bookingRequest) => {
            currentStartDate = new Date(bookingRequest.startDate)
            currentEndDate = new Date(bookingRequest.endDate)

            if (date >= currentStartDate && date <= currentEndDate
                || focusedInput === 'endDate' && startDate < currentStartDate && date >= currentStartDate){
                blocked = true;
                return false;
            }
            return true;
        });
        return blocked;
    }

    return (
        <div className="agritourism__signupform" >
            <h2 className="agritourism__signupform-title">Send Booking Request</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                <Row className="mb-4">
                    <Col>
                        <Form.Control required className={(user.role && user.role == "customer") ? "text-muted": ""} disabled={requestPending || user.role && user.role == "customer"} placeholder="Vorname" type="text" value={firstName} onChange={event => setFirstName(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide a first name!</Form.Control.Feedback>
                    </Col>
                    <Col className='mr-0'>
                        <Form.Control required className={(user.role && user.role == "customer") ? "text-muted": ""} disabled={requestPending || user.role && user.role == "customer"} placeholder="Nachname" type="text" value={lastName} onChange={event => setLastName(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide a last name!</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Form.Control required className={(user.role && user.role == "customer") ? "text-muted": ""} disabled={requestPending || user.role && user.role == "customer"} placeholder="E-mail-Adresse" type="email" value={email} onChange={event => setEmail(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide a correct email adress!</Form.Control.Feedback>
                    </Col>
                </Row>
                    <Row className="test mb-4">
                    <DateRangePicker
                        startDate={startDate}
                        startDateId="start-date"
                        startDatePlaceholderText="Arrival"
                        endDatePlaceholderText="Departure"
                        endDate={endDate}
                        endDateId="end-date"
                        onDatesChange={({ startDate, endDate }) => {
                            if (focusedInput === "startDate")
                                setEndDate();
                            else 
                                setEndDate(endDate);

                            setStartDate(startDate);
                            
                        }}
                        focusedInput={focusedInput}
                        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                        isOutsideRange={isDayBlocked}
                        enableOutsideDays={false}
                    />
                    <Form.Control.Feedback type="invalid">Please provide a valid time frame!</Form.Control.Feedback>
                </Row>
                
                <Row className="mb-4">
                    <Col>
                        <Form.Control required placeholder="Number of guests" type="number" disabled={requestPending} value={numberPeople} onChange={event => setNumberPeople(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please provide the number of guests!</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Control required placeholder="Number of rooms" type="number" min="1" max={props.farmer ? props.farmer.tourism.roomCapacity : 100} disabled={requestPending} value={numberRooms} onChange={event => setNumberRooms(event.target.value)} />
                        <Form.Control.Feedback type="invalid">There are not that many rooms available. Max available: {props.farmer ? props.farmer.tourism.roomCapacity : 100}</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Form.Control required placeholder="Short Bio - Tell us about yourself!" as="textarea" rows="8" disabled={requestPending} value={introText} onChange={event => setIntroText(event.target.value)} />
                        <Form.Control.Feedback type="invalid">Please present yourself!</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Check className='mb-4'>
                            <Form.Check.Input required checked={checked} type={"checkbox"} isValid onChange={(e) => setChecked(!checked)}/>
                            <Form.Check.Label>I agree that my personal data is stored on the server and that I am contacted regarding my booking request</Form.Check.Label>
                            <Form.Control.Feedback type="invalid">Please accept to these terms!</Form.Control.Feedback>
                        </Form.Check>
                    </Col>
                </Row>
                <Button type="submit" className="d-block w-100" variant="primary" disabled={requestPending}>
                    Submit
                </Button>
                <div className="mt-4 text-danger">
                    {invalidFormMessage != "" && <p>{invalidFormMessage}</p>}
                </div>
            </Form>
            <Modal show={show} centered onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="mb-0">Request send</h4>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>Your booking request was sent with id: {requestId}. The farmer will contact you as soon as possible.</Modal.Body>
            </Modal>
        </div>
    )
}

export default AgritourismSignUp