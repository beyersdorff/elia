import React, { useState, useEffect } from "react";

// service
import ApiService from '../../services/Api.service';

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const CartSummary = (props) => {

  return (
    <div className="shopping-cart__summary">
      <h5 className="mb-4">Summary</h5>
      <Row>
        <Col>Subtotal</Col>
        <Col className="col-auto">{ props.total ? (props.total*0.93).toFixed(2) : 0.00 } €</Col>
      </Row>
      <Row>
        <Col>Tax</Col>
        <Col className="col-auto">{ props.total ? (props.total*0.07).toFixed(2) : 0.00 } €</Col>
      </Row>
      <Row className="mt-2">
        <Col>Total</Col>
        <Col className="col-auto">{ props.total ? props.total.toFixed(2) : 0.00 } €</Col>
      </Row>
      <Button disabled={ props.outOfAvailability.length !== 0 } type="submit" className="mt-3 d-block w-100 mb-2" onClick={() => {if(!props.additionalInfo) props.nextStep()}}>
        {props.buttonText}
      </Button>
      {props.additionalInfo && <div>{props.additionalInfo}</div>}
    </div>
  )
}

export default CartSummary;