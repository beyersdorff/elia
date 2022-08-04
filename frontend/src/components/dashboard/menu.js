import { useNavigate } from 'react-router-dom';

// bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

//Context
import { useUser, useUserUpdate } from '../../contexts/user';

const Menu = () =>{

    const user = useUser()

    const navigate = useNavigate();

    const handleClick = (selectedCollection) => {
        navigate("/dashboard", {state: {selectedCollection: selectedCollection}})     
    }

    return (
        <div className="filter p-4 mb-4 mb-lg-0">
            <Row className="mb-4">
                <Col>
                    <h3>MyELIA</h3>
                    <div>
                        Logged in as: {user.role} {user.name}
                    </div>
                    <div>
                        {user.role !== "admin" && "Email: "}{user.email}
                    </div>
                </Col>
            </Row>
            {(user.role === "farmer" || user.role==="admin") &&
                <Row>
                    <Col>
                        <h6>Products</h6>
                        <Button variant="link" onClick = {() => handleClick("products")}>
                            All Products
                        </Button>
                        <Button variant="link" onClick = {() => navigate("/dashboard/product/"+"newProduct")}>
                            Create New Product
                        </Button>
                        <hr></hr>
                    </Col>
                </Row>
            }
            {(user.role === "farmer" || user.role==="admin") &&
                <Row>
                    <Col>
                        <h6>{user.role === "admin"?"Farmers": "Your Account"}</h6>
                        <Button variant="link" onClick = {() => handleClick("farmers")}>
                            {user.role === "admin"?"All Farmers": "Personal Informaion"}
                        </Button>
                        {user.role === "admin" &&
                            <Button variant="link" onClick = {() => navigate("/dashboard/farmer/"+"newFarmer")}>
                                Create New Farmer
                            </Button>
                        }
                        <hr></hr>
                    </Col>
                </Row>
            }
            {user.role === "farmer" &&
                <Row>
                    <Col>
                        <h6>Agritourism</h6>
                        <Button variant="link" onClick={() => handleClick("agritourism")}>
                            All Bookings
                        </Button>
                        <hr></hr>
                    </Col>
                </Row>
            }
            {(user.role === "farmer" || user.role==="admin") &&
                <Row>
                    <Col>
                        <h6>Orders</h6>
                        <Button variant="link" onClick = {() => handleClick("orders")}>
                            All Orders
                        </Button>
                    </Col>
                </Row>
            }
        </div>
    )
}

export default Menu