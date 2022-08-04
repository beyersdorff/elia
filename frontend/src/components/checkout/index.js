import React, { useState, useContext, useEffect } from "react";
import { CartStateContext } from "../../contexts/cart";

// service
import ApiService from '../../services/Api.service';

// components
import CartList from './cart/cart-list.js';
import CartSummary from './cart-summary.js';
import PurchaseOption from "./purchase-option";
import Form from "./form";

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

//Context
import { useUser } from '../../contexts/user';
import Login from "./form/login";

const Checkout = () => {
  const checkoutFailed = new URLSearchParams(window.location.search).get("checkoutFailed");
  const failedOrderId = new URLSearchParams(window.location.search).get("orderId");
  const [showAlert, setShowAlert] = useState(checkoutFailed == "true" ? true : false);
  const { items } = useContext(CartStateContext);
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState();
  const [purchaseOption, setPurchaseOption] = useState("");
  const [outOfAvailability, setOutOfAvailability] = useState([]);

  // Context
  const user = useUser()

  useEffect(() => {
    var subTotal = 0
    items.map(item => {
      subTotal += item.quantity * item.price;
    })
    setTotal(subTotal)
  }, [items]);

  useEffect(() => {
    if(failedOrderId !== null) {
      ApiService.httpDelete(`order/${failedOrderId}`, user.token)
    }

    items.map(item => {
      const notAvailableItems = [];
      if(item.available_bottles < item.quantity) {
        notAvailableItems.push(item.stock_id)
        setOutOfAvailability([...notAvailableItems, item.stock_id]);
      }

    })
  }, [])

  const nextStep = () => {
    setStep(step + 1)
  }

  const stepBack = () => {
    setStep(step - 1)
  }

  const putPurchaseOption = (option) => {
    setPurchaseOption(option);
    nextStep();
  }

  switch (step) {
    case 0:
      return (
        <div className="shopping-cart">
          <Container className="mb-5">
            { showAlert &&
              <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                Oh snap! You got an error: Please start the checkout process again.
              </Alert>
            }
            <Row>
              <h1>Shopping Cart</h1>
            </Row>
          </Container>
          <Container>
            {items.length !== 0 ? (
              <Row className="justify-content-between">
                <Col xs={12} lg={9}>
                  <CartList outOfAvailability={outOfAvailability} setOutOfAvailability={setOutOfAvailability} items={items} />
                </Col>
                <Col xs={12} lg={3}>
                  <CartSummary outOfAvailability={outOfAvailability} total={total} nextStep={nextStep} buttonText="Continue"/>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <div>You have no items in your shopping cart.</div>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      )
    case 1:
      return (<PurchaseOption nextStep={nextStep} putPurchaseOption={putPurchaseOption} stepBack={stepBack} total={total}/>)
    case 2:
      if (!user.token || user.role !== "customer"){
        return (<Login />)
      } else {
        return (<Form purchaseOption ={purchaseOption} items={items} total={total} nextStep={nextStep} stepBack={stepBack} outOfAvailability={outOfAvailability}/>)
      }
  }
}

export default Checkout;