import React, { Component } from 'react';
import Toast from 'react-bootstrap/Toast';
import { Col, Row } from 'react-bootstrap';

class ToastMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  toggleShow = () => {
    const { show } = this.state;
    this.setState({ show: !show });
  };

  setToastType = i => {
    switch (i) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-danger';
      default:
        return '';
    }
  };

  render() {
    const { show } = this.state;
    return (
      <Row className="toast-wrapper">
        <Col xs={12}>
          <Toast show={show} onClose={this.props.onClose} animation={true}>
            <Toast.Header>
              <strong className="mr-auto">{this.props.heading}</strong>
              {/* <small>11 mins ago</small> */}
            </Toast.Header>
            <Toast.Body className={this.setToastType(this.props.type)}>{this.props.message}</Toast.Body>
          </Toast>
        </Col>
      </Row>
    );
  }
}

export default ToastMsg;
