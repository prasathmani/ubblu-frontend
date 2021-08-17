import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import { Row, Col, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './authLayout.scss';
import 'components/Signup/index.scss';

const AuthLayout = props => (
  <Container fluid={true} className="auth__layout login">
    <div className="auth__layout__wrapper">
      <Container>
        <header>
          <Link to="/">
            <Image src="/assets/images/ubblu-logo-2x.png" alt="Ubblu" />
          </Link>
        </header>
      </Container>
      <Row className="justify-content-center align-items-center auth__layout__form--wrapper">
        <Col xs="12" sm="6" md="6" lg="4">
          {props.children}
        </Col>
      </Row>
    </div>
  </Container>
);

export default AuthLayout;
