import React, { Component, useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


// service
import ApiService from '../../../services/Api.service'

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OpenBookingItem from './OpenBookingItem';
import Accordion from 'react-bootstrap/Accordion';

//Context
import { useUser } from '../../../contexts/user';
import AcceptedBookingItem from './AcceptedRequest';

// Icon
import { IconContext } from "react-icons";
import { BiDownArrow } from 'react-icons/bi';

const DashboardAgritourism = () => {
  //Context
  const user = useUser()
 
  const [openBookings, setOpenBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);

  const navigate = useNavigate();
  
  useEffect(() => {
    ApiService.httpGet(`farmer/dashboard/${user._id}`, user.token)
      .then(res => {
        if(res.data.data.tourism && res.data.data.tourism.bookingRequests) setSortedRequests(res.data.data.tourism.bookingRequests)
      })
      .catch(err => {
        console.error(err)
        navigate("/");
      })
  }, []);

  const setSortedRequests = (requests) => {
    requests = requests.sort((a, b) => {
      if (a.startDate > b.startDate)
        return 1;
      else if (a.startDate < b.startDate)
        return -1;
      else
        return 0
    })
    setOpenBookings(requests.filter(bookingRequest => !bookingRequest.accepted))
    setAcceptedBookings(requests.filter(bookingRequest => bookingRequest.accepted))
  }

  const getOpenAccordionBody = (list) => {
    if (openBookings.length > 0)
      return (
          openBookings.map((booking, index) => {
            return <OpenBookingItem key={booking._id} booking={booking} setSortedRequests={setSortedRequests}/>
          })
      )
    else
      return (<div>No open booking requests</div>)
  }

  const getAcceptedAccordionBody = () => {
    if (acceptedBookings.length > 0)
      return (
          acceptedBookings.map((booking, index) => {
            return <AcceptedBookingItem key={booking._id} booking={booking} setSortedRequests={setSortedRequests}/>
          })
      )
    else
      return (<div>No accepted booking requests</div>)
  }

    return (
        <Container className='mt-4'>
            <Row className="filter_panel mb-3">
              <Col>
                <Accordion defaultActiveKey="0" alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header><div className='dashboard__agritourism-accordionHeader'>Open Requests:</div></Accordion.Header>
                    <Accordion.Body>
                      {getOpenAccordionBody()}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header><div className='dashboard__agritourism-accordionHeader'>Accepted Bookings:</div></Accordion.Header>
                    <Accordion.Body>
                      {getAcceptedAccordionBody()}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
        </Container>
      )
  }

export default DashboardAgritourism;
