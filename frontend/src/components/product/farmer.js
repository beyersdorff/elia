import React, { useEffect } from "react";

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

const Farmer = ({ product, farmer }) => {

  useEffect(() => {
  }, []);

  return (
    <Container>
      <div className="product__family pt-5">
        <Row>
          <Col lg={6}>
            <Carousel indicators={false} controls={ farmer?.pictures?.length > 1 }>
              {farmer?.pictures?.map(item => (
              <Carousel.Item key={item} interval={10000}>
                <img
                  className="d-block w-100"
                  src={"http://localhost:4200/uploads/"+item}
                  alt="Farmer"
                />
              </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col lg={6}>
            <h2>About us</h2>
            <div>
              {farmer.description}
              <br>
              </br>
              { farmer.tourism &&
                <a
                  className="btn btn-primary mt-3"
                  href={"/agritourism/" + product.farmerID}
                >
                  Visit the farmer
                </a>
              }
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default Farmer;