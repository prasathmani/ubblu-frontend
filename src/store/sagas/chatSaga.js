import { ACTION, API } from 'common/constants';
import { call, fork, put, take } from 'redux-saga/effects';
import { changeAvailabilityStatus } from 'store/api';
import { USERID } from 'common/utils/helper';
import { eventChannel } from 'redux-saga';
import { generateId } from 'common/utils';
import io from 'socket.io-client';

const socketServerURL = API.WSS;
const currentUserId = USERID() || '';

// wrapping functions for socket events (connect, disconnect, reconnect)
let socket;
const connect = () => {
  socket = io(socketServerURL, { query: `userId=${currentUserId}` });
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

// eslint-disable-next-line
const disconnect = () => {
  socket = io(socketServerURL);
  return new Promise(resolve => {
    socket.on('disconnect', () => {
      resolve(socket);
    });
  });
};

// eslint-disable-next-line
const reconnect = () => {
  socket = io(socketServerURL);
  return new Promise(resolve => {
    socket.on('reconnect', () => {
      resolve(socket);
    });
  });
};

// This is how channel is created
const subscribeAction = socket =>
  eventChannel(emit => {
    //receive msg
    socket.on(ACTION.CHAT_RECEIVE_MESSAGE, (...data) => {
      emit(...data);
    });

    //AVAILABILITY
    socket.on(ACTION.AVAILABILITY, (...data) => {
      console.log('AVAILABILITY_GET - ', ...data);
      const newItem = Object.assign({}, ...data, { type: ACTION.AVAILABILITY_GET });
      emit(newItem);
      // yield apply(socket, socket.emit, ['pong']);
    });

    socket.on(ACTION.CHAT_SEND_MESSAGE, (...data) => {
      const newObj = Object.assign({}, ...data, { type: ACTION.CHAT_RECEIVE_MESSAGE, id: generateId() });
      console.info('WSS RECV << ', newObj);
      emit(newObj);
    });

    return () => { };
  });

function* read(socket) {
  const channel = yield call(subscribeAction, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* write(ACTION_TYPE) {
  while (true) {
    let { payload } = yield take(ACTION_TYPE);
    socket.emit(ACTION_TYPE, payload);
  }
}

// saga listens for all actions
function* actionSaga() {
  socket = yield call(connect);
  yield fork(read, socket);

  //actions
  yield fork(write, ACTION.AVAILABILITY);
  yield fork(write, ACTION.CHAT_SEND_MESSAGE);
}

export const WatchSocketSagas = function* () {
  yield call(actionSaga);
};



export function* updateAvailabilitySaga(payload) {
  try {
    console.log('before saga func', payload);
    const response = yield call(changeAvailabilityStatus, payload);
    yield put({ type: ACTION.AVAILABILITY_SET_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.AVAILABILITY_SET_SUCCESS, error });
  }
}
