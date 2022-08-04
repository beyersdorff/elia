import React from 'react';
import xIcon from '../../../assets/icons/x-white.svg';


// bootstrap components
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


const StocksList = (props) => {

    const stocks = props.stocks
    const setStocks = props.setStocks

    const removeStock = (stock) => {
        console.error(stock.listID)
        let filteredArr = stocks.filter((el) => el.listID !== stock.listID);
        setStocks(filteredArr);
      };

      const updateStockSize= (size, listID) => {
        let newStocks = stocks.map((stock)=>{
          if(stock.listID === listID) return {...stock, size: size}
          return stock
        })
        setStocks(newStocks)
      };

      const updateStockNrBottles= (NrBottles, listID) => {
        let newStocks = stocks.map((stock)=>{
          if(stock.listID === listID) return {...stock, available_bottles: NrBottles}
          return stock
        })
        setStocks(newStocks)
      };

      const updateStockPrice= (price, listID) => {
        let newStocks = stocks.map((stock)=>{
          if(stock.listID === listID) return {...stock, price: price}
          return stock
        })
        setStocks(newStocks)
      };

    return(
    <>
    <ul className="list-group">
      <div className="Gruppe">  <h5 className="card-title">All Stocks</h5></div>
      {props.stocks.map((stock) =>{
        const {size, price, available_bottles, listID} = stock;
        return(
          <>
            <li className="list-group-item">
              <Row className="mb-4">
                <Col className ="col-3">
                	<Form.Label>Bottle <br/> Size</Form.Label>
                  <Form.Control required className={""} step="0.01" min="0.01" placeholder="size" type="number" value={size} onChange={event => updateStockSize(event.target.value, listID) } />
                </Col>
                <Col className ="col-3">
                  <Form.Label>Available Bottles</Form.Label>
                  <Form.Control required className={""} step="1" min="0" placeholder="available bottles" type="number" value={available_bottles} onChange={event => updateStockNrBottles(event.target.value, listID)} />
                </Col>
                <Col className ="col-4">
                  <Form.Label>Price <br/> in Euros</Form.Label>
                  <Form.Control required className={""} step="0.01" min="0.00" placeholder="price" type="number" value={price} onChange={event => updateStockPrice(event.target.value, listID)} />
                </Col>
                <Col className ="col-2">
                  <div className="shopping-cart__item-label mb-2">
                    Delete<br/> Stock
                  </div>
                  <Button variant="danger" onClick = {() => removeStock(stock)}>
                    <img src={xIcon} alt="Remove icon" width="20" height="20" />
                  </Button>
                </Col>
              </Row>
            </li>
          </>
        )
      })}
    </ul>
    </>)
}

export default StocksList;