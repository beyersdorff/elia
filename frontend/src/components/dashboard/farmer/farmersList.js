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
import { useUser } from '../../../contexts/user';

//functions
const FarmersList = () => {
    const [farmers, setFarmers] = useState([]);
    const navigate = useNavigate();

    // Context
    const user = useUser()

    useEffect(() => {
          ApiService.httpGet(`farmer/dashboard`, user.token)
          .then(res => {
            setFarmers(res.data.data)
          })
          .catch(err => {
            console.error(err);
            navigate("/");
          })
      }, []);

      return (
        <ListGroup>
          <h3>{user.role === "admin"?"All Farmers":""}</h3>
          {(farmers.length <1)&& <h5>There are currently no farmers in the database.</h5> }
          {farmers.map((farmer) =>{
            const {name, _id, email} = farmer;
            return(
              <>
                <ListGroup.Item key={_id}>
                  <Row>
                    <Col className="mb-4 mb-lg-0 col-3">
                      <h5 >{name}</h5>
                    </Col>
                    <Col className="mb-4 mb-lg-0 col-7">
                      {email}
                    </Col>
                    <Col className="col-2">
                      <Button className="btn btn-primary text-right" onClick = {() => navigate("farmer/"+_id)}>Edit</Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </>
            )
          })}
        </ListGroup>
      )
}

export default FarmersList;