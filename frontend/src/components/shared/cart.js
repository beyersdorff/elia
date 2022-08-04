import React, { Component, useContext } from 'react';
import { Link } from "react-router-dom";
import { CartStateContext, CartDispatchContext } from "../../contexts/cart";

// assets
import icon from '../../assets/icons/shopping-bag.svg';

const Cart = () => {
  const { items } = useContext(CartStateContext);
  const dispatch = useContext(CartDispatchContext);

  return (
    <Link to="/cart">
      <div className="cart">
          <img src={icon} className="cart__icon" width="20" height="20" alt="Shopping cart" />
          <span className="cart__quantity">
            { items.length }
          </span>
      </div>
    </Link>
  )
}

export default Cart;