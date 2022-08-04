import React, { useState, useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import { CartDispatchContext, updateQuantityCart, removeFromCart } from "../../../contexts/cart";

// service
import ApiService from '../../../services/Api.service';

// assets
import xIcon from '../../../assets/icons/x-white.svg';

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

const CartItem = ({ outOfAvailability, setOutOfAvailability, item }) => {
  const dispatch = useContext(CartDispatchContext);
  const [show, setModalShow] = useState(false);
  const [availableBottles, setAvailableBottles] = useState(item.available_bottles);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  useEffect(() => {
    if(availableBottles < item.quantity) {
      if(!outOfAvailability.filter(id => id == item.stock_id).length > 0) {
        setOutOfAvailability(prevState => [...prevState, item.stock_id]);
      }
    } else {
      setOutOfAvailability(outOfAvailability.filter(id => id !== item.stock_id));
    }
  }, [item.quantity]);

  const handleRemoveItem = (stockId) => {
    return removeFromCart(dispatch, stockId);
  }

  const incrementQuantity = (stockId) => {
    const itemData = {
      stock_id: stockId,
      quantity: item.quantity + 1
    };
    updateQuantityCart(dispatch, itemData);
  }
  const decrementQuantity = (stockId) => {
    const itemData = {
      stock_id: stockId,
      quantity: item.quantity - 1
    };
    updateQuantityCart(dispatch, itemData);
  }

  const handleQuantityInputChange = (event, stockId) => {
    const quantity = event.target.value;
    const itemData = {
      stock_id: stockId,
      quantity: quantity
    };
    updateQuantityCart(dispatch, itemData);
  }

  return (
    <div className="shopping-cart__item">
      <Row>
        <Col className="mb-4 mb-lg-0" xs={12} lg={6}>
          <Row>
            <Col className="col-auto">
              <Link to={ "/product/"+item.product_id }>
                <div className="shopping-cart__item-image">
                  <img src={"http://localhost:4200/uploads/"+item?.picture} alt="" />
                </div>
              </Link>
            </Col>
            <Col>
              <div className="shopping-cart__item-name mb-2">
                <Link to={ "/product/"+item.product_id }>
                  { item.name }
                </Link>
              </div>
              <div className="shopping-cart__item-description">
                <small>{ item.description }</small>
              </div>
              <div className="shopping-cart__item-label mt-3">
                Size
              </div>
              <div>
                { item.size } Liter
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} lg={6}>
          <Row>
            <Col style={{ minWidth: '187px' }}>
              <Form>
                <Row className="align-items-start">
                  <Form.Group as={Col}>
                    <Form.Label>Quantity</Form.Label>
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <Button className="product__form-counter" onClick={() => decrementQuantity(item.stock_id)}>-</Button>
                      </Col>
                      <Col className="px-0" xs={5}>
                        <Form.Control type="number" onChange={(event) => handleQuantityInputChange(event, item.stock_id)} min="1" value={item.quantity} name="quantity" />
                      </Col>
                      <Col className="col-auto">
                        <Button disabled={ availableBottles < item.quantity } className="product__form-counter" onClick={() => incrementQuantity(item.stock_id)}>+</Button>
                      </Col>
                    </Row>
                    { availableBottles < item.quantity &&
                      <div className="mt-2 text-danger fw-bold">
                        <small>Only { availableBottles } bottles left in stock</small>
                      </div>
                    }
                  </Form.Group>
                </Row>
              </Form>
            </Col>
            <Col>
              <div className="shopping-cart__item-label mt-1 mb-3">
                Price
              </div>
              <div className="shopping-cart__item-price">
                { item.price * item.quantity } €
              </div>
            </Col>
            <Col className="col-auto">
              <div className="shopping-cart__item-label mt-1 mb-3">
                Remove
              </div>
              <Button variant="danger" className="shopping-cart__item-remove" onClick={handleModalShow}>
                <img src={xIcon} alt="Remove icon" width="20" height="20" />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal show={show} centered onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="mb-0">Remove item</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this item from the shopping cart?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleRemoveItem(item.stock_id)}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CartItem;