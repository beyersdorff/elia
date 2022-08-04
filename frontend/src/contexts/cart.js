/*
  Documentation: https://reactjs.org/docs/context.html
*/

import React, { useReducer, createContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const initialState = {
  items: []
};

export const CartStateContext = createContext();
export const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const stock_id = action.payload.cartItem.stock_id;
      const isOld = state.items.map((item) => item.stock_id).includes(stock_id);
      let cartItems = null;
      if (isOld) {
        const items = state.items.map((item) => {
          if (item.stock_id === stock_id) {
            return {
              ...item,
              quantity: item.quantity + action.payload.cartItem.quantity
            };
          }
          return item;
        });
        cartItems = [...items];
      } else {
        cartItems = [...state.items, action.payload.cartItem];
      }
      return {
        ...state,
        items: cartItems
      };
    case "UPDATE_QUANTITY_CART":
      var updatedCartItem = null;
      const items = state.items.map((item) => {
        if (item.stock_id === action.payload.cartItem.stock_id) {
          return {
            ...item,
            quantity: !!action.payload.cartItem.quantity && Math.abs(action.payload.cartItem.quantity) >= 0 ? Math.abs(action.payload.cartItem.quantity) : 1
          };
        }
        return item;
      });
      updatedCartItem = [...items];
      return {
        ...state,
        items: updatedCartItem
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.stock_id !== action.payload.cartItemId
        )
      };
    case "CLEAR_CART":
      return {
        ...state,
        ...initialState
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const addToCart = (dispatch, cartItem) => {
  return dispatch({
    type: "ADD_TO_CART",
    payload: {
      cartItem: cartItem
    }
  });
};

export const updateQuantityCart = (dispatch, cartItem) => {
  return dispatch({
    type: "UPDATE_QUANTITY_CART",
    payload: {
      cartItem: cartItem
    }
  });
};


export const removeFromCart = (dispatch, cartItemId) => {
  return dispatch({
    type: "REMOVE_FROM_CART",
    payload: {
      cartItemId: cartItemId
    }
  });
};

export const clearCart = (dispatch) => {
  return dispatch({
    type: "CLEAR_CART"
  });
};

const CartProvider = ({ children }) => {
  const [persistedCartItems, setPersistedCartItems] = useLocalStorage(
    "cartItems",
    []
  );

  const persistedCartState = {
    items: persistedCartItems || []
  };

  const [state, dispatch] = useReducer(reducer, persistedCartState);
  useEffect(() => {
    setPersistedCartItems(state.items);
  }, [JSON.stringify(state.items)]);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export default CartProvider;