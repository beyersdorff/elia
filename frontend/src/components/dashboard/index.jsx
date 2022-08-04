import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import DashboardAgritourism from "./agritourism/Overview";
import FarmersList from "./farmer/farmersList";
import ProductsList from "./product/productsList";
import OrdersList from "./orders/ordersList";
import Menu from "./menu"

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

//Context
import { useUser, useUserUpdate } from '../../contexts/user';

//functions
const LandingPageDashboard = () => {

    const user = useUser()
    const location = useLocation();
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState((location.state && location.state.alert && location.state.alert !== "undefined") ? true : false);

    const getCorrespondingList = () =>{
      if(location.state && location.state.selectedCollection && location.state.selectedCollection !== "undefined"){
        if(location.state.selectedCollection==="products"){
          return(<ProductsList/> )
        }else if(location.state.selectedCollection==="farmers"){
          return(<FarmersList />)
        }else if(location.state.selectedCollection==="agritourism"){
          return( <DashboardAgritourism /> )
        }else if(location.state.selectedCollection==="orders"){
          return( <OrdersList /> )
        }else{
          console.error("unexpected value for state selected collection")
          navigate("/")
      }}else{
          //no state is set in the beginning and we load the products or the orders for the customers
          if(user.role === "customer" ) return ( <OrdersList />)
          return(<ProductsList /> )
      }
    }

    const closeAlert = () =>{
      navigate("/dashboard", {state: {alert: "undefined", selectedCollection: location.state.selectedCollection}})
      setShowAlert(false)
    }

    return (
        <div className="dashboard">
          <Container className="mb-5">
            {showAlert &&
              <Alert variant="success" onClose={() => closeAlert()} dismissible>
                Success: {location.state.alert}
              </Alert>
            }
            <Row className="mb-3">
              <Col xs={12} lg={3}>
                <Menu/>
              </Col>
              <Col xs={12} lg={9}>
                {getCorrespondingList()}
              </Col>
            </Row>
          </Container>
        </div>
      )
  }

export default LandingPageDashboard;