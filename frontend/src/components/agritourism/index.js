import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// service
import ApiService from '../../services/Api.service'

// assets
import starFilled from '../../assets/icons/star-filled.svg';
import agritourism_form from '../../assets/images/agritourism_form.avif';
import formImage from '../../assets/images/agritourism-form.jpeg';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

import AgritourismSignUp from "./signup";

const Agritourism = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.httpGet(`farmer/${id}`)
      .then(res => {
        setFarmer(res.data.data)
      })
      .catch(err => {
        navigate("/");
      })
  }, []);


  return (
    <div className="agritourism">
      <Container>
        <Row>
          <Col>
            <Row>
                <h2>Get to know { farmer ? farmer.name : null} and his family!</h2>
            </Row>
            <Row>
                <p> { farmer ? farmer.tourism.description : null }</p>
            </Row>
          </Col>
          <Col lg={6}>
            <img className="agritourism__image" src={"http://localhost:4200/uploads/"+farmer?.tourism?.title_picture} title="#" />
          </Col>
        </Row>
      </Container>
      <Container>
        <div className="agritourism__region pt-5">
          <Row>
            <Col lg={6}>
              <Carousel indicators={false} controls={ farmer?.tourism?.region_pictures?.length > 1 }>
                {farmer?.tourism?.region_pictures.map(item => (
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
              <h2>{ farmer ? farmer.tourism.region_title : null} </h2>
              <p>{ farmer ? farmer.tourism.region_description : null }</p>
            </Col>
          </Row>
        </div>
      </Container>
      <Container>
        <div className="agritourism__activity pt-5">
          <Row>
            <Col lg={6}>
              <h2>Lots and lots of things to explore!</h2>
              <p>{ farmer ? farmer.tourism.activity_description : null}</p>
            </Col>
            <Col lg={6}>
              <Carousel indicators={false} controls={ farmer?.tourism?.activity_pictures?.length > 1 }>
                {farmer?.tourism?.activity_pictures.map(item => (
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
          </Row>
        </div>
      </Container>
      <Container>
        <div className="agritourism__signup">
            <Row>
                <Col>
                    <img className="agritourism__signup-image" src={formImage} title="#"/>
                </Col>
                <Col lg={6}>
                    <AgritourismSignUp farmer={farmer}/>
                </Col>
            </Row>
        </div>
      </Container>
    </div>
  )
}

export default Agritourism;