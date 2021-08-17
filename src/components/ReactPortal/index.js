import React from 'react';
import ReactDOM from 'react-dom';

class ModalPortal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'c-modal-portal');
  }

  componentDidMount() {
    document.getElementById('ReactModalPortal').appendChild(this.el);
  }

  componentWillUnmount() {
    document.getElementById('ReactModalPortal').removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

class ToastPortal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'c-toast-portal');
  }

  componentDidMount() {
    document.getElementById('ReactToastPortal').appendChild(this.el);
  }

  componentWillUnmount() {
    document.getElementById('ReactToastPortal').removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export { ModalPortal, ToastPortal };
