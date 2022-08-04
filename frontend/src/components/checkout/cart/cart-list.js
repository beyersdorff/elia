import React, { useState, useEffect, useContext } from "react";

// service
import ApiService from '../../../services/Api.service';

// components
import CartItem from './cart-item.js';

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CartList = ({ outOfAvailability, setOutOfAvailability, items }) => {

  return (
    <div className="shopping-cart__list">
      {items?.map((item) => {
        return (
          <CartItem outOfAvailability={outOfAvailability} setOutOfAvailability={setOutOfAvailability} key={item.stock_id} item={item} />
        );
      })}
    </div>
  )}

export default CartList;