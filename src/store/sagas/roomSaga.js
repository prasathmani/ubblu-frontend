import { put, call } from 'redux-saga/effects';
import { setSeletedRoomAxios, getConversationHistoryAxios , getSearchOutput, getConversationHistory} from 'store/api';
import { ACTION } from 'common/constants';

export function* getConversationHistorySaga(data) {
  try {
    const payload = yield call(getConversationHistory, data.payload);
    yield put({ type: ACTION.CONVERSATION_HISTORY_SET, ...payload });
  } catch (error) {
    yield put({ type: ACTION.CONVERSATION_HISTORY_SET, error });
  }
}

export function* setSeletedRoomSaga(payload) {  
  try {
    // if (payload.data.user) {
    //   response = { self: payload.data.user };
    // } else {
    //   response = yield call(setSeletedRoomAxios, payload.data);
    // }
    // response = yield call(setSeletedRoomAxios, payload.data);
    yield put({ type: ACTION.ROOM_CONVERSATION_VIEW, payload });
  } catch (error) {
    yield put({ type: ACTION.ROOM_CONVERSATION_VIEW, error });
  }
}

export function* setSeletedRoomIdSaga(payload) {  
  try {
    yield put({ type: ACTION.CHANNEL_ID, payload });
  } catch (error) {
    yield put({ type: ACTION.CHANNEL_ID, error });
  }
}
