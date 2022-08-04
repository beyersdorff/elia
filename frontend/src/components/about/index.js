import React from "react";

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// assets
import greece from '../../assets/images/regions/greece.svg';
import alberto from '../../assets/images/team/alberto.jpeg';
import alex from '../../assets/images/team/alex.jpeg';
import janek from '../../assets/images/team/janek.jpeg';
import luca from '../../assets/images/team/luca.jpeg';

const AboutUs = () => {

  return (
    <div className="about">
      <Container className="mb-5">
        <Row className="position-relative">
          <Col lg={5}>
            <h1 className="mb-4 pt-5">
              ELIA brings Greek regionality to European kitchens.
            </h1>
            <a href="/" className="btn btn-primary">
              Discover the best Greek olive oils
            </a>
          </Col>
          <img className="about__map" src={greece} alt="" />
        </Row>
      </Container>
      <Container className="my-5">
        <Row>
          <h2 className="about__headline mb-4 mt-5">
            Our Idea
          </h2>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={3}>
            <h4>Value Proposition</h4>
            <p>ELIA leaves out several intermediaries and sells olive oil directly from producer to consumer while enforcing high ecological standards for production. This enables a higher pay for the producers and a better oil for you.</p>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <h4>Key Activities</h4>
            <p>ELIA is selecting the producers based on high standards and stays in close collaboration with them. ELIA also takes care of all steps necessary for bringing the oil from the fields to your kitchen.</p>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <h4>Key Resources</h4>
            <p>ELIA's key resources is strong networks of production and service partners. First and foremost, this includes all our local producers that you can get to know on this webpage.</p>
          </Col>
        </Row>
      </Container>
      <Container className="my-5">
        <Row>
          <h2 className="about__headline mb-4">
            Our Team
          </h2>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={3}>
            <img className="about__team-image" src={alberto} width="150" alt="Alberto" />
            <h4 className="mt-4">Alberto Beyersdorff</h4>
            <h6 className="opacity-75">M.Sc. Information Systems</h6>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <img className="about__team-image" src={alex} width="150" alt="Alex" />
            <h4 className="mt-4">Alex Berger</h4>
            <h6 className="opacity-75">M.Sc. Computer Science</h6>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <img className="about__team-image" src={janek} width="150" alt="Janek" />
            <h4 className="mt-4">Janek Falkenstein</h4>
            <h6 className="opacity-75">M.Sc. Computer Science</h6>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <img className="about__team-image" src={luca} width="150" alt="Luca" />
            <h4 className="mt-4">Luca Kittelmann</h4>
            <h6 className="opacity-75">M.Sc. Information Systems</h6>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AboutUs;