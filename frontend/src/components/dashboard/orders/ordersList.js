import React, {  useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Order from "./order"


// service
import ApiService from '../../../services/Api.service'

// bootstrap components
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

//Context
import { useUser } from '../../../contexts/user';

//functions
const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const user = useUser()

    useEffect(() => {
      ApiService.httpGet(`order`, user.token)
      .then(res => {
        setOrders(res.data.data)
      })
      .catch(err => {
        console.error(err);
        navigate("/");
      })
    }, []);


    return (
      <ListGroup>
        <h3>All Orders</h3>
        {(orders.length <1)&& <h5>There are currently no Orders in the database.</h5> }
        {orders.map((order) =>{
          return(
            <Order key={order._id} order={order}/>
          )
        })}
      </ListGroup>
    )
}

export default OrdersList;