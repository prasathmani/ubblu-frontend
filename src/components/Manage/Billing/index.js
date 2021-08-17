import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const Billing = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="text-center mt-5">
            <h5>Choose the plan that's right for your team</h5>
            <p>Pay by month or the year and cancel at any time.</p>
          </div>
          <div className="card-deck mt-3 mb-3 text-center">
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">STANDARD</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  $6.67 <small className="text-muted">/ mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>10 users included</li>
                  <li>2 GB of storage</li>
                  <li>Email support</li>
                  <li>Help center access</li>
                </ul>
                <button type="button" className="btn btn-lg btn-block btn-primary">
                  Upgrade now
                </button>
              </div>
            </div>
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">PLUS</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  $12.50 <small className="text-muted">/ mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>20 users included</li>
                  <li>10 GB of storage</li>
                  <li>Priority email support</li>
                  <li>Help center access</li>
                </ul>
                <button type="button" className="btn btn-lg btn-block btn-primary">
                  Upgrade now
                </button>
              </div>
            </div>
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">ENTERPRISE GRID</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  $29 <small className="text-muted">/ mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>30 users included</li>
                  <li>15 GB of storage</li>
                  <li>Phone and email support</li>
                  <li>Help center access</li>
                </ul>
                <button type="button" className="btn btn-lg btn-block btn-outline-primary">
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Billing;
