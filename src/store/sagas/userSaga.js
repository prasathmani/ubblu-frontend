import { all, call, put, select } from 'redux-saga/effects';
import {
  getAllUsers,
  getInboxUsersAxios,
  getUserByIdAxios,
  getUserProfileDetails,
  getWorkspacesById,
  updateUserProfileDetails,
  changePassword,
} from 'store/api';

import { ACTION } from 'common/constants';
import { get as _get } from 'lodash';
import { getCookie } from 'common/utils';

export const workspaceStore = state => _get(state, 'user.response.workspace');
/**
 * Get user and workspace details using saga
 * Param {data} object
 */
export function* getUserProfileDetailsSaga(data) {
  try {
    // const response = yield call(getUserProfileDetails, data.payload);
    const [users, workspace] = yield all([
      call(getUserProfileDetails, data.payload),
      call(getWorkspacesById, data.payload),
    ]);
    const response = Object.assign({}, users.data
      // , workspace.data
    );
    yield put({ type: ACTION.GET_USER_PROFILE_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.GET_USER_PROFILE_SUCCESS, error });
  }
}

/**
 * *Update user details using saga
 * Param {data} object
 */
export function* updateUserProfileDetailsSaga(data) {
  try {
    const response = yield call(updateUserProfileDetails, data.payload);
    yield put({ type: ACTION.UPDTAE_USER_PROFILE_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.UPDTAE_USER_PROFILE_SUCCESS, error });
  }
}

/**
 * Get list of recent user chat history
 */
export function* getInboxUsersSaga() {
  try {
    const workspace = yield select(workspaceStore);
    const workspaceId = (workspace && workspace.id) || getCookie('wid');
    const userId = getCookie('uid');
    const response = yield call(getInboxUsersAxios, workspaceId, userId);
    yield put({ type: ACTION.INBOX_USER_LIST_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.INBOX_USER_LIST_RESPONSE, error });
  }
}

/**
 * Get list of recent user chat history
 */
export function* getUserByIdSaga() {
  try {
    const response = yield call(getUserByIdAxios);
    yield put({ type: ACTION.GET_USER_BY_ID_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.GET_USER_BY_ID_RESPONSE, error });
  }
}

export function* getAllUsersByWorkspaceSaga(data) {
  try {
    const response = yield call(getAllUsers, data.payload);
    yield put({ type: ACTION.MANAGE_USERS_GETALL_RES, response });
  } catch (error) {
    yield put({ type: ACTION.MANAGE_USERS_GETALL_RES, error });
  }
}

/* Change password */

export function* changePwdSaga(data) {
  try {
    const response = yield call(changePassword, data.payload);
    console.log('change password response', response);
    yield put({ type: ACTION.CHANGE_PASSWORD_SUCCESS, response });
    // yield put(push(ROUTES.APP_ROOT));
  } catch (error) {
    yield put({ type: ACTION.CHANGE_PASSWORD_ERROR, error });
  }
}
