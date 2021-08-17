import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createStore, compose, applyMiddleware } from 'redux';

import rootSaga from './sagas';
import reducers from './reducers';

/**
 * History of choice
 * Browser history is used in this case
 */
export const history = createBrowserHistory();
/**
 * Saga Middleware
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * Middlewares for redux
 * For intercepting and dispatching navigation actions
 */
const historyMiddleware = routerMiddleware(history);
const middlewares = applyMiddleware(historyMiddleware, sagaMiddleware);

const store = createStore(reducers(history), compose(middlewares));

sagaMiddleware.run(rootSaga);

export default store;
