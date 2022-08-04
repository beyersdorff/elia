import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";

// service
import ApiService from '../../services/Api.service';

// assets
import geo from "../../assets/icons/geo-alt.svg";

// bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SimilarProducts = ({ id }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ApiService.httpGet(`product/`)
      .then(res => {
        setProducts(res.data.data.filter(item => item._id !== id).slice(0, 2))
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  const rating = (reviews) => {
    const ratings = reviews.map(a => a.stars);
    return (
      ratings.length > 0 ? Math.round(ratings.reduce((partialSum, a) => partialSum + a, 0) / ratings.length * 10) / 10 : 0
    );
  }

  return (
    <div>
      <h2 className="pt-5 mb-4">More products</h2>
      <Row>
        {products.map(item => (
          <Col key={item._id} xs={12} md={6}>
            <div className="mb-3">
              <img style={{ borderRadius: '6px'}} src={"http://localhost:4200/uploads/"+item?.picture} alt="#" />
              <h5 className="mt-3">
                <a className="text-reset text-decoration-none" href={"/product/" + item?._id}>
                  {item?.name}
                </a>
              </h5>
              <div className="d-block my-3">
                <img src={geo} className="pe-2" />
                This olive oil is from {item?.region}.
              </div>
              <div className="d-block my-3">
                <ReactStars
                  value={rating(item?.reviews)}
                  size={20}
                  isHalf={true}
                  edit={false}
                  activeColor="#BBCC44"
                />
              </div>
              <div className="d-block fw-bold my-3" >
                <small>
                  {/*{lowestPrice(item?.stocks)}€*/}
                </small>
              </div>
              <a className="btn btn-primary" href={"/product/" + item?._id}>
                More details
              </a>
            </div>
          </Col>
        ))}
      </Row>
      { products.length == 0 &&
        <div className="mb-2">
          No other products.
        </div>
      }
    </div>
  )
}

export default SimilarProducts;