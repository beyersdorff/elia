import React, { useState, useContext, useEffect } from "react";
import { CartDispatchContext, addToCart } from "../../contexts/cart";

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const OrderForm = ({ stock, product, reviews, setPrice }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [availableBottles, setAvailableBottles] = useState(1);
  const [outOfAvailability, setOutOfAvailability] = useState(false);
  const [orderFormValidated, setOrderFormValidated] = useState(false);
  const [orderValues, setOrderValues] = useState({
    stock_id: '',
    size: 0,
    price: 0,
    quantity: 1
  });

  const dispatch = useContext(CartDispatchContext);

  useEffect(() => {
    setOrderValues((orderValues) => ({
      ...orderValues,
      stock_id: stock?.[0]?._id,
      size: stock?.[0]?.size.toString(),
      price: stock?.[0]?.price,
    }));
    setAvailableBottles(stock?.[0]?.available_bottles)
    if (stock?.[0]?.available_bottles <= 0 ) {
      setOutOfStock(true)
    }
  }, [stock]);

  useEffect(() => {
    setOutOfAvailability(availableBottles < orderValues.quantity)
  }, [orderValues.quantity]);

  const handleSizeInputChange = (event) => {
    const bottleById = stock.filter((e) => e._id === event.target.value)[0]
    const newAvailableBottles = bottleById.available_bottles
    const newPrice = bottleById.price
    event.persist();
    setOrderValues((orderValues) => ({
      ...orderValues,
      stock_id: event.target.value,
      size: event.target.selectedOptions[0].getAttribute('data-size'),
      price: newPrice
    }));
    setAvailableBottles(newAvailableBottles)
    setOutOfAvailability(newAvailableBottles < orderValues.quantity)
    setPrice(newPrice)
    setOutOfStock(false)
  };

  const handleQuantityInputChange = (event) => {
    setOrderValues((orderValues) => ({
      ...orderValues,
      quantity: Number.isNaN(event.target.valueAsNumber) ? event.target.value : event.target.valueAsNumber,
    }));
  };

  const handleAddToCart = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const productData = {
        product_id: product._id,
        name: product.name,
        picture: product.picture,
        description: product.description,
        stock_id: orderValues.stock_id,
        price: orderValues.price,
        size: orderValues.size,
        quantity: orderValues.quantity,
        available_bottles: availableBottles
      };
      addToCart(dispatch, productData);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }
    setOrderFormValidated(true);
  };

  const incrementQuantity = () => {
    setOrderValues((orderValues) => ({
      ...orderValues,
      quantity: orderValues.quantity + 1
    }));
  }
  const decrementQuantity = () => {
    setOrderValues((orderValues) => ({
      ...orderValues,
      quantity: orderValues.quantity - 1
    }));
  }

  return (
    <div>
      <Form className="product__form" noValidate validated={orderFormValidated} onSubmit={handleAddToCart}>
        <Row className="align-items-end">
          <Form.Group as={Col}>
            <Form.Label className="d-block">Size</Form.Label>
            { stock.length > 0 &&
              <Form.Select required onChange={handleSizeInputChange} value={orderValues.stock_id} name="size">
                {
                  stock.map(item => (
                    <option disabled={item.available_bottles <= 0} key={item._id} value={item._id} data-size={item.size}>{item.size} liter</option>
                  ))
                }
              </Form.Select>
            }
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label className="d-block">Quantity</Form.Label>
            <Row className="align-items-center">
              <Col className="col-auto">
                <Button className="product__form-counter" onClick={decrementQuantity}>-</Button>
              </Col>
              <Col className="px-0" xs={5}>
                <Form.Control type="number" required onChange={handleQuantityInputChange} min="1" value={orderValues.quantity} name="quantity" />
              </Col>
              <Col className="col-auto">
                <Button className="product__form-counter" onClick={incrementQuantity}>+</Button>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group as={Col}>
            <Button disabled={ outOfStock || outOfAvailability } type="submit">
              {!isAdded ? "ADD TO CART" : "✔ ADDED"}
            </Button>
          </Form.Group>
        </Row>
      </Form>
      { outOfStock &&
        <div className="mt-2 text-danger fw-bold">
          Out of stock
        </div>
      }
      { outOfAvailability && !outOfStock &&
        <div className="mt-2 text-danger fw-bold">
          Only { availableBottles } bottles left in stock
        </div>
      }
    </div>
  )
}

export default OrderForm;