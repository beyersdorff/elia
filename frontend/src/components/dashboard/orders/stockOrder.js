import React, { useState,useEffect } from 'react';

// service
import ApiService from '../../../services/Api.service'

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Context
import { useUser } from '../../../contexts/user';

//functions
const StockOrder = (props) => {
    const stockOrder = props.stockOrder
    const [productName, setProductName] = useState()
    const [stockSize, setStockSize] = useState()
    const user = useUser()

    useEffect(() => {
        ApiService.httpGet(`product/dashboard/${stockOrder.product}`, user.token)
        .then(res => {
          setProductName(res.data.data.name)
          let stockObj = res.data.data.stocks.find(element => element._id === stockOrder.stock);
          setStockSize(stockObj.size)
        }).catch(err => {
          console.error("product not found")
          console.error(err)
          setProductName("not Found")
          setStockSize("Product Not Found")
        })
      }, []);
    
    return(
        <Container>
            <Row className="align-items-center">
            <Col className = "col-6">
                Product Name: {productName}
            </Col>
            <Col className = "col-3" >
                Size: {stockSize} Liter
            </Col>
            <Col className = "col-3" >
                Quantity: {stockOrder.quantity}
            </Col>
            </Row>
        </Container>
    )
}

export default StockOrder