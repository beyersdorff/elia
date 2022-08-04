import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

// assets
import arrowLeft from '../../../assets/icons/arrow-left.svg';

const PurchaseOption = (props) => {

    return (
        <Container>
            <h1 className="purchase-option__title">Select your purchase option</h1>
            <Button className="px-0 mb-3" color="primary" variant="link" onClick={props.stepBack}>
                <img className="me-2" src={arrowLeft} width="15" height="15" alt="" />
                Go back to the shopping cart
            </Button>
            <Row>
                <Col xs='5' className="purchase-option">
                <div className="purchase-option__description"> Ever felt the need to try out new mediterranean flavours? Rich, dense, complex savors? Or do you just want to make sure that your stock of high quality olive oil is always full? With our two purchase options the choice is yours! If you just want to get a glimpse of the greek way of living and enjoy a sample out of the finest collection of oils, the "once" option suits you best. On the other hand, if you never want to miss out on our liquid gold again we recommend you to choose the "subscription" option. We will send you your oil selection stress free every 4 weeks, right to your doorstep. So you can focus on cooking, experimenting and tasting our 'elaiolado'. </div>
                </Col>
                <Col className="text-center">
                    <div className="purchase-option__option purchase-option__option-1">
                        <h3>Once</h3>
                        Perfect for tasting. Our oil will be delivered to you immediately.
                        <div className="purchase-option__option-price">
                            <h2>{props.total} €</h2>
                            <b>one-time</b>
                        </div>
                        <Button className="purchase-option__option-button" onClick={() => props.putPurchaseOption("payment")}>Continue</Button>
                    </div>
                </Col>
                <Col className="text-center">
                    <div className="purchase-option__option purchase-option__option-2">
                        <h3 className="purchase-option__option-2-title">Subscription</h3>
                        Never worry about your oil reserves again. You get your oil every month.
                        <div className="purchase-option__option-price">
                            <h2 className="purchase-option__option-2-title">{props.total} €</h2>
                            <b>every 4 weeks</b>
                        </div>
                        <Button className="purchase-option__option-button purchase-option__option-2-button" onClick={() => props.putPurchaseOption("subscription")}>Continue</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default PurchaseOption;