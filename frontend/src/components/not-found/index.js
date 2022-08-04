import React from "react";
import { Link } from 'react-router-dom';

// service
import ApiService from '../../services/Api.service';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NotFound = () => {

  return (
    <div className="not-found">
      <Container className="mb-5">
        <Row>
          <h1>404 - Not Found 😢</h1>
          <Link to="/">Go Home</Link>
        </Row>
      </Container>
    </div>
  )
}

export default NotFound;