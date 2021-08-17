import { ACTION, ROUTES } from 'common/constants';
import { call, put } from 'redux-saga/effects';
import { checkWorkPlaceName, forgotPasswordCheck, getUserProfileDetails, loginUser, setPassword } from 'store/api';

import { CLEAR_SESSION } from 'common/utils/helper';
import { push } from 'connected-react-router';

export function* workspaceSigninSagaEffect(data) {
  try {
    const response = yield call(checkWorkPlaceName, data.payload);
    yield put({ type: ACTION.SIGNIN_WORKSPACE_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.SIGNIN_WORKSPACE_RESPONSE, error });
  }
}

export function* loginSagaEffect(data) {
  try {
    const response = yield call(loginUser, data.payload);
    console.log('login response', response);
    yield put({ type: ACTION.LOGIN_USER_SUCCESS, response });
    // yield put(push(ROUTES.APP_ROOT));
  } catch (error) {
    yield put({ type: ACTION.LOGIN_USER_ERROR, error });
  }
}

/**
 * Logout Operation using saga
 */
// Saga function that handles the side effect when the logoutActionWatcher is triggered
export function* logoutSagaEffect(data) {
  try {
    CLEAR_SESSION();
    if (data.payload.redirectToLogin === true) yield put(push(ROUTES.LOGIN_ROUTE));
  } catch (e) {
    // yield put(authError(e));
  }
}

/**
 * Forgot password Operation using saga
 * Param {data} object
 */
export function* forgotPwdSagaEffect(data) {
  try {
    const response = yield call(forgotPasswordCheck, data.payload);
    yield put({ type: ACTION.FORGOT_PWD_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.FORGOT_PWD_ERROR, error });
  }
}

/**
 * Set new password using saga
 * Param {data} object
 */
export function* setPasswordSagaEffect(data) {
  try {
    const response = yield call(setPassword, data.payload);
    yield put({ type: ACTION.SET_PASSWORD_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.SET_PASSWORD_ERROR, error });
  }
}

/**
 * Get user details using saga
 * Param {data} object
 */
export function* getUserProfileDetailsSaga(data) {
  try {
    const response = yield call(getUserProfileDetails, data.payload);
    yield put({ type: ACTION.GET_USER_PROFILE_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.GET_USER_PROFILE_SUCCESS, error });
  }
}
