import React, {  useState,useEffect } from 'react';
import StockOrdersList from "./stockOrdersList"


// service
import ApiService from '../../../services/Api.service'

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

//Context
import { useUser } from '../../../contexts/user';

//functions
const Order = (props) => {
    const order = props.order
    const user = useUser()
    const [customerEmail, setCustomerEmail] = useState("");

    useEffect(() => {
      if(user.role !== "farmer"){
        ApiService.httpGet(`customer/dashboard/${order.customer}`, user.token)
        .then(res => {
          setCustomerEmail(res.data.data.email)
        }).catch(err => {
          console.error("customer not found")
          console.error(err)
        })
      }
    }, []);

    return (
      <ListGroup.Item>
        <Row>
        {user.role !== "customer" &&
        <Col className = "col-2">
           <h5>Customer:</h5> 
        </Col>
        }
        {user.role !== "customer" &&
          <Col className="col-4">
            {user.role==="farmer" ? "anonym": customerEmail}
          </Col>
        }
          <Col className="mb-4 mb-lg-0">
            <h5>Total Price: </h5>
          </Col>
          <Col className="mb-4 mb-lg-0">
           {order.total} €
          </Col>
        </Row>
        <Row>
        
            <StockOrdersList stockOrders = {order.stockOrders}/>
          
        </Row>
      </ListGroup.Item>
    )
}

export default Order;