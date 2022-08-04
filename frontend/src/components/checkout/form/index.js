import { useState, useContext } from "react";

// Bootstrap
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/esm/FormGroup.js";

// service
import ApiService from "../../../services/Api.service";

// components
import CartSummary from "../cart-summary.js";

// assets
import arrowLeft from '../../../assets/icons/arrow-left.svg';
import stripeBadge from "../../../assets/images/stripe.png";

// Context
import { useUser } from "../../../contexts/user";
import { clearCart, CartDispatchContext } from "../../../contexts/cart";

const CheckoutForm = (props) => {
  const [formOfAddressInvoice, setFormOfAddressInvoice] = useState("");
  const [firstNameInvoice, setFirstNameInvoice] = useState("");
  const [lastNameInvoice, setLastNameInvoice] = useState("");
  const [email, setEmail] = useState("");
  const [streetInvoice, setStreetInvoice] = useState("");
  const [houseNumberInvoice, setHouseNumberInvoice] = useState("");
  const [postalCodeInvoice, setPostalCodeInvoice] = useState("");
  const [locationInvoice, setLocationInvoice] = useState("");

  const [formOfAddressDelivery, setFormOfAddressDelivery] = useState("");
  const [firstNameDelivery, setFirstNameDelivery] = useState("");
  const [lastNameDelivery, setLastNameDelivery] = useState("");
  const [streetDelivery, setStreetDelivery] = useState("");
  const [houseNumberDelivery, setHouseNumberDelivery] = useState("");
  const [postalCodeDelivery, setPostalCodeDelivery] = useState("");
  const [locationDelivery, setLocationDelivery] = useState("");

  const [invalidFormMessage, setInvalidFormMessage] = useState("");
  const [requestPending, setRequestPending] = useState(false);
  const [requestId, setRequestId] = useState("");

  // Validation
  const [validated, setValidated] = useState(false);

  // Context
  const user = useUser();
  const dispatch = useContext(CartDispatchContext);

  const submit = event => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false || user.role != "customer") {
        event.stopPropagation();
    } else {
        setRequestPending(true);

        const orders =[];
        props.items.forEach(element => {
            orders.push({
                quantity: element.quantity,
                product: element.product_id,
                stock: element.stock_id
            })
        })

        ApiService.httpPost(`order`, {
            customer: user._id,
            paymentMethod: {name: "stripe"},
            stockOrders: orders,
            purchaseOption: props.purchaseOption,
            price: props.total*0.93,
            tax: props.total*0.07,
            total: props.total,
            address: streetInvoice+houseNumberInvoice,
            additional_info: "info",
            zip: postalCodeInvoice,
            city: locationInvoice,
            shipping_first_name: firstNameDelivery,
            shipping_last_name: lastNameDelivery,
            shipping_address: streetDelivery+houseNumberDelivery,
            shipping_additionalInfo: "info",
            shipping_zip: postalCodeDelivery,
            shipping_city: locationDelivery
        }, user.token)
            .then(res => {
                if (res.data.success) {
                    window.location.href = res.data.url
                } else {
                    setInvalidFormMessage(`Invalid form: ${res.data.message}`);
                }
                })
            .catch(err => {
                console.error(err);
                setInvalidFormMessage(`Could not confirm order: ${err.response.data.error}`);
                })
            .finally(() => {
                setRequestPending(false);
            });
    }

    setValidated(true);
  };

  return (
    <Container className="pb-5">
      <Row>
        <Col>
          <h1 className="checkout__title">Checkout</h1>
          <Button variant="link" className="px-0 mb-3" onClick={props.stepBack}>
            <img className="me-2" src={arrowLeft} width="15" height="15" alt="" />
            Back to the purchase option
          </Button>
        </Col>
      </Row>
      <Form validated={validated} onSubmit={submit}>
      <Row className="justify-content-between">
        <Col xs={12} lg={8} className="checkout__form">
          <h2>Invoice data</h2>
            <FormGroup>
              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    Title
                  </Form.Label>
                  <Form.Select
                    value={formOfAddressInvoice}
                    onChange={event =>
                      setFormOfAddressInvoice(event.target.value)
                    }
                    required
                    aria-label="Title"
                  >
                    <option>Please select</option>
                    <option value="Frau">Ms</option>
                    <option value="Herr">Mr</option>
                    <option value="Keine Angabe">Not specified</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label className="checkout__form-label">
                    E-mail address
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a correct e-mail address
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    First name
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={firstNameInvoice}
                    onChange={event => setFirstNameInvoice(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your first name
                  </Form.Control.Feedback>
                </Col>
                <Col className="mr-0">
                  <Form.Label className="checkout__form-label">
                    Last name
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={lastNameInvoice}
                    onChange={event => setLastNameInvoice(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your last name
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    Street
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={streetInvoice}
                    onChange={event => setStreetInvoice(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your street
                  </Form.Control.Feedback>
                </Col>
                <Col className="mr-0">
                  <Form.Label className="checkout__form-label">
                    House number
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={houseNumberInvoice}
                    onChange={event =>
                      setHouseNumberInvoice(event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your house number
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    Postal code
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={postalCodeInvoice}
                    onChange={event => setPostalCodeInvoice(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your postal code
                  </Form.Control.Feedback>
                </Col>
                <Col className="mr-0">
                  <Form.Label className="checkout__form-label">City</Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={locationInvoice}
                    onChange={event => setLocationInvoice(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please state your place of residence
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </FormGroup>

            <h2>Shipping address</h2>
            <FormGroup>
              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    Title
                  </Form.Label>
                  <Form.Select
                    value={formOfAddressDelivery}
                    onChange={event =>
                      setFormOfAddressDelivery(event.target.value)
                    }
                    required
                    aria-label="Title"
                  >
                    <option>Please select</option>
                    <option value="Frau">Ms</option>
                    <option value="Herr">Mr</option>
                    <option value="Keine Angabe">Not specified</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    First name
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={firstNameDelivery}
                    onChange={event => setFirstNameDelivery(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your first name
                  </Form.Control.Feedback>
                </Col>
                <Col className="mr-0">
                  <Form.Label className="checkout__form-label">
                    Last name
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={lastNameDelivery}
                    onChange={event => setLastNameDelivery(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your last name
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    Street
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={streetDelivery}
                    onChange={event => setStreetDelivery(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your street
                  </Form.Control.Feedback>
                </Col>
                <Col className="mr-0">
                  <Form.Label className="checkout__form-label">
                    House number
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={houseNumberDelivery}
                    onChange={event =>
                      setHouseNumberDelivery(event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your house number
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label className="checkout__form-label">
                    Postal code
                  </Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={postalCodeDelivery}
                    onChange={event =>
                      setPostalCodeDelivery(event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your postal code
                  </Form.Control.Feedback>
                </Col>
                <Col className="mr-0">
                  <Form.Label className="checkout__form-label">City</Form.Label>
                  <Form.Control
                    required
                    disabled={requestPending}
                    type="text"
                    value={locationDelivery}
                    onChange={event => setLocationDelivery(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please state your place of residence
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </FormGroup>

            <h2>Payment method</h2>
            <img className="mt-2 checkout__form-payment-image" src={stripeBadge} />

            <div className="mt-4 text-danger">
              {invalidFormMessage != "" && <p>{invalidFormMessage}</p>}
            </div>
        </Col>
        <Col xs={12} lg={4}>
          <CartSummary
            total={props.total}
            nextStep={submit}
            additionalInfo="Notice: Once you confirm your order, your cart will be discarded."
            buttonText="Order now"
            outOfAvailability={props.outOfAvailability}
          />
        </Col>
      </Row>
      </Form>
    </Container>
  );
};

export default CheckoutForm;
