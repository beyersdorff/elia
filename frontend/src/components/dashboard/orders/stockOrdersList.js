import React  from 'react';
import StockOrder from "./stockOrder"


// bootstrap components
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';

//functions
const StockOrdersList = (props) => {
    const stockOrders = props.stockOrders

    return(
        <Container>
            <Accordion>
                <Accordion.Item eventKey="0">
                <Accordion.Header><font size="+1">Items of the Order</font></Accordion.Header>
                <Accordion.Body>
                        {stockOrders && stockOrders.map((stockOrder) =>{
                        return(
                            <StockOrder key={stockOrder._id} stockOrder = {stockOrder}/>
                        )
                        })}
                </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    )

}

export default StockOrdersList