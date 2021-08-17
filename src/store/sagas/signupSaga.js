import { put, call } from 'redux-saga/effects';
import { signupStep1, signupStep2, signupStep3, signupStep4, signupStep5 } from 'store/api';

import { ACTION } from 'common/constants';

export function* signupSagaEffect(data) {
  try {
    const response = yield call(signupStep1, data.payload);
    yield put({ type: ACTION.SIGNUP_1_SUCCESS, response });
  } catch (error) {
    yield put({ type: ACTION.SIGNUP_1_ERROR, error });
  }
}

export function* signupStep2SagaEffect(data) {
  try {
    const response = yield call(signupStep2, data.payload);
    yield put({ type: ACTION.SIGNUP_2_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.SIGNUP_2_RESPONSE, error });
  }
}

export function* signupStep3SagaEffect(data) {
  try {
    const response = yield call(signupStep3, data.payload);
    yield put({ type: ACTION.SIGNUP_3_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.SIGNUP_3_RESPONSE, error });
  }
}

export function* signupStep4SagaEffect(data) {
  try {
    const response = yield call(signupStep4, data.payload);
    yield put({ type: ACTION.SIGNUP_4_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.SIGNUP_4_RESPONSE, error });
  }
}

export function* signupStep5SagaEffect(data) {
  try {
    const response = yield call(signupStep5, data.payload);
    yield put({ type: ACTION.SIGNUP_5_RESPONSE, response });
  } catch (error) {
    yield put({ type: ACTION.SIGNUP_5_RESPONSE, error });
  }
}
