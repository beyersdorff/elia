import React, { Component } from 'react';

// assets
import logo from '../../assets/images/logo_white.svg';
import instagram from '../../assets/icons/instagram.svg';
import facebook from '../../assets/icons/facebook.svg';
import linkedin from '../../assets/icons/linkedin.svg';

// bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <Row className="align-items-center">
            <Col sm={6}>
              <img src={logo} className="footer__logo" alt="Elia" />
            </Col>
            <Col sm={6}>
              <Row>
                <Col>
                  <a className="footer__link footer__link-mail" href="mailto:hello@elia.eu" title="hello@elia.eu">hello@elia.eu</a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a className="footer__link" href="/about" title="about">That's us!</a>
                </Col>
              </Row>
              <div className="footer__social">
                <a className="footer__social-icon" href="#" target="_blank" title="Facebook">
                  <img src={facebook} width="30" height="30" alt="Facebook" />
                </a>
                <a className="footer__social-icon" href="#" target="_blank">
                  <img src={instagram} width="30" height="30" alt="instagram" title="Instagram" />
                </a>
                <a className="footer__social-icon" href="#" target="_blank" title="Linkedin">
                  <img src={linkedin} width="30" height="30" alt="Linkedin" />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    )
  }
}

export default Footer;