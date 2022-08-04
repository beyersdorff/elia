import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

// service
import ApiService from "../../services/Api.service";

// assets
import starFilled from "../../assets/icons/star-filled.svg";
import map from "../../assets/icons/map.svg";
import clock from "../../assets/icons/clock.svg";
import filter from "../../assets/icons/filter.svg";

// components
import Reviews from "./reviews.js";
import OrderForm from "./order-form.js";
import SimilarProducts from "./similar-products.js";
import Farmer from "./farmer.js";

// bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "moment/locale/en-nz"; // without this line it didn't work
moment.locale("en-nz");

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [farmer, setFarmer] = useState([]);
  const [stock, setStock] = useState([]);
  const [price, setPrice] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.httpGet(`product/${id}`)
      .then(res => {
        setProduct(res.data.data);
        ApiService.httpGet(`farmer/${res.data.data.farmerID}`)
          .then(res => {
            setFarmer(res.data.data);
          })
          .catch(err => {
            navigate("/");
          });
        setStock(res.data.data.stocks);
        setPrice(res.data.data.stocks[0].price);
        setReviews(res.data.data.reviews);
      })
      .catch(err => {
        navigate("/");
      });
  }, []);

  const handleClickOnRating = () => {
    const anchor = document.querySelector("#reviewAnchor");
    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="product">
      <Container>
        <Row>
          <Col lg={6}>
            <div className="product__profile">
              <Row className="align-items-center">
                <Col className="col-auto">
                  <div className="product__profile-image">
                    {farmer.profile_picture && <img src={"http://localhost:4200/uploads/"+farmer.profile_picture} alt="Farmer profile" />}
                  </div>
                </Col>
                <Col>
                  <h2 className="mb-0">{product.name} </h2>

                  <div
                    className="product__profile-rating"
                    onClick={handleClickOnRating}
                  >
                    <Row className="align-items-center">
                      <Col className="col-auto pe-0">
                        <img
                          src={starFilled}
                          alt="Star"
                          width="18"
                          height="18"
                        />
                      </Col>
                      <Col className="col-auto ps-1">
                        <div>{reviews.length} Reviews</div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="align-items-center">
              <Col>{product.description}</Col>
              <Col className="col-auto">
                <div className="product__profile-price">{price} €</div>
              </Col>
            </Row>
            <div className="product__attributes">
              <Row>
                <Col>
                  <div className="product__attributes-item">
                    <img src={map} alt="Icon" width="20" height="20" />
                    <div className="product__attributes-label">Region</div>
                    <div>{product.region}</div>
                  </div>
                </Col>
                <Col>
                  <div className="product__attributes-item">
                    <img src={clock} alt="Icon" width="20" height="20" />
                    <div className="product__attributes-label">
                      Harvest date
                    </div>
                    <div>{moment(product.harvesting_date).format("MMMM")}</div>
                  </div>
                </Col>
                <Col>
                  <div className="product__attributes-item">
                    <img src={clock} alt="Icon" width="20" height="20" />
                    <div className="product__attributes-label">
                      Growth height
                    </div>
                    <div>{product.growth_height} m</div>
                  </div>
                </Col>
                <Col>
                  <div className="product__attributes-item">
                    <img src={filter} alt="Icon" width="20" height="20" />
                    <div className="product__attributes-label">Filtration</div>
                    <div>
                      {product.filtration ? "Filtrated" : "Unfiltrated"}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <OrderForm
              stock={stock}
              product={product}
              reviews={reviews}
              setPrice={setPrice}
            />
          </Col>
          <Col lg={6}>
            { product.picture &&
            <img
              className="product__image"
              src={"http://localhost:4200/uploads/"+product.picture}
              alt="Product"
            />
            }
          </Col>
        </Row>
      </Container>
      <Farmer product={product} farmer={farmer} />
      <Container className="pb-4">
        <Row>
          <Col lg={6}>
            <Reviews id={id} reviews={reviews} setReviews={setReviews} />
          </Col>
          <Col lg={6}>
            <SimilarProducts id={id} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Product;
