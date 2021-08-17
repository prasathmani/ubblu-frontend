//Fonts, bootstrap, style
import 'typeface-roboto';
import 'bootstrap/dist/css/bootstrap.css';
import './scss/App.scss';
import 'react-virtualized/styles.css';

import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';
import store from './store/index';

const Root = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
