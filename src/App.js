import React, { Component } from 'react';
import { getCookie } from './common/utils';
import { push } from 'connected-react-router';

import store from './store';
import { ROUTES } from './common/constants';

class App extends Component {
  constructor() {
    super();
    if (getCookie('at')) {
      store.dispatch(push(ROUTES.MESSAGES));
    } else {
      document.location.assign(ROUTES.LOGIN);
    }
  }

  render() {

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

export default App;
