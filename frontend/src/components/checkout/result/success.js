import { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

// Service
import ApiService from "../../../services/Api.service";

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Context
import { useUser } from "../../../contexts/user";
import { clearCart, CartDispatchContext } from "../../../contexts/cart";

const CheckoutSuccess = (props) => {
    const { orderId } = useParams();

    // Context
    const user = useUser();
    const dispatch = useContext(CartDispatchContext);

    useEffect(() => {
     clearCart(dispatch);
    }, [])

    return (
        <Container className="my-5">
            <Row>
                <h2 className="mb-4">Thank you for your order.</h2>
                <div>
                    We hope you will be satisfied with your olive oil.
                </div>
                <div className="mb-3">
                    <b>Order ID:</b> { orderId }
                </div>
                <Link to="/">Forgotten something else? Order now</Link>
            </Row>
        </Container>
    )
}

export default CheckoutSuccess;
