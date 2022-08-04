import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// service
import ApiService from '../../../services/Api.service'

// bootstrap components
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Context
import { useUser, useUserUpdate } from '../../../contexts/user';

//functions
const ProductsList = () => {

    const user = useUser()

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      ApiService.httpGet(`product`)
      .then(res => {
        if(user.role === "admin") setProducts(res.data.data)
        else{
          let farmerProducts=[]
          farmerProducts=res.data.data.filter(product => product.farmerID === user._id)
          setProducts(farmerProducts)
        }
      })
      .catch(err => {
        console.error(err);
        navigate("/");
      })
    }, []);

    return (
        <ListGroup>

          <h3>All Products</h3>
          {(products.length <1)&& <h5>There are currently no products in the database.</h5> }
          {products.map((product) =>{
            const {name, description, _id} = product;
            return(
              <ListGroup.Item key={_id}>
                <Row className="align-items-center justify-content-between">
                  <Col className="col-auto">
                    <div className="dashboard__item-image">
                      <img src={"http://localhost:4200/uploads/"+product?.picture} alt={name} />
                    </div>
                  </Col>
                  <Col>
                    <h5>{name}</h5>
                    {description}
                  </Col>
                  <Col>
                    <Button className="float-end" onClick = {() => navigate("product/"+_id)}>Edit</Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            )
          })}
      </ListGroup>
    )
}

export default ProductsList;