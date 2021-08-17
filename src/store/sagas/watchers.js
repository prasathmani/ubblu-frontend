import {
  forgotPwdSagaEffect,
  loginSagaEffect,
  logoutSagaEffect,
  setPasswordSagaEffect,
  workspaceSigninSagaEffect,
} from './loginSaga';
import {
  getAllUsersByWorkspaceSaga,
  getInboxUsersSaga,
  getUserByIdSaga,
  getUserProfileDetailsSaga,
  updateUserProfileDetailsSaga,
  changePwdSaga,
} from './userSaga';
import {
  getConversationHistorySaga
  , setSeletedRoomSaga,
  setSeletedRoomIdSaga
} from './roomSaga';
import {
  signupSagaEffect,
  signupStep2SagaEffect,
  signupStep3SagaEffect,
  signupStep4SagaEffect,
  signupStep5SagaEffect,
} from './signupSaga';

import {
  getSearchResultsSaga,
  getMutedConversationsSaga,
  getStarredConversationsSaga,
  getTaggedConversationsSaga,
  getDirectConversationsSaga,
  getChannelConversationsSaga
} from './inboxSaga';


import {
  updateAvailabilitySaga
} from './chatSaga';

import { ACTION } from 'common/constants';
import { takeLatest } from 'redux-saga/effects';

export function* watchWorkspaceSignin() {
  yield takeLatest(ACTION.SIGNIN_WORKSPACE, workspaceSigninSagaEffect);
}

export function* watchUserLogin() {
  yield takeLatest(ACTION.LOGIN_USER, loginSagaEffect);
}

// Saga function that is initiated in the beginning to be able to listen to LOG_OUT_WATCHER action
export function* watchUserLogout() {
  yield takeLatest(ACTION.LOGOUT_USER, logoutSagaEffect);
}

export function* watchForgotPasswordCheck() {
  yield takeLatest(ACTION.FORGOT_PASSWORD, forgotPwdSagaEffect);
}

export function* watchSetPassword() {
  yield takeLatest(ACTION.SET_PASSWORD, setPasswordSagaEffect);
}

export function* watchChangePassword() {
  yield takeLatest(ACTION.CHANGE_PASSWORD, changePwdSaga);
}

export function* watchSignup() {
  yield takeLatest(ACTION.SIGNUP_1, signupSagaEffect);
}

export function* watchSignup2() {
  yield takeLatest(ACTION.SIGNUP_2, signupStep2SagaEffect);
}

export function* watchSignup3() {
  yield takeLatest(ACTION.SIGNUP_3, signupStep3SagaEffect);
}

export function* watchSignup4() {
  yield takeLatest(ACTION.SIGNUP_4, signupStep4SagaEffect);
}

export function* watchSignup5() {
  yield takeLatest(ACTION.SIGNUP_5, signupStep5SagaEffect);
}

export function* watchGetUserProfileDetails() {
  yield takeLatest(ACTION.GET_USER_PROFILE, getUserProfileDetailsSaga);
}

export function* watchUpdateUserProfileDetails() {
  yield takeLatest(ACTION.UPDATE_USER_PROFILE, updateUserProfileDetailsSaga);
}

export function* watchGetInboxUsers() {
  yield takeLatest(ACTION.INBOX_USER_LIST, getInboxUsersSaga);
}

export function* setSeletedRoomWatch() {
  yield takeLatest(ACTION.CHAT_SELECTED_ROOM, setSeletedRoomSaga);
}


export function* setSeletedRoomIdWatch() {
  yield takeLatest(ACTION.CHANNEL_ID, setSeletedRoomIdSaga);
}


export function* getConversationHistoryWatch() {
  yield takeLatest(ACTION.CONVERSATION_HISTORY_GET, getConversationHistorySaga);
}

export function* getSearchResultsWatch() {
  yield takeLatest(ACTION.SEARCH_MESSAGES, getSearchResultsSaga);
}


export function* getTaggedConversationsWatch() {
  yield takeLatest(ACTION.TAGGED_MESSAGES, getTaggedConversationsSaga);
}


export function* getDirectConversationsWatch() {
  yield takeLatest(ACTION.DIRECT_MESSAGES, getDirectConversationsSaga);
}


export function* getChannelConversationsWatch() {
  yield takeLatest(ACTION.CHANNEL_MESSAGES, getChannelConversationsSaga);
}



export function* getStarredConversationsWatch() {
  yield takeLatest(ACTION.STARRED_MESSAGES, getStarredConversationsSaga);
}


export function* getMutedConversationsWatch() {
  yield takeLatest(ACTION.MUTED_MESSAGES, getMutedConversationsSaga);
}


export function* getUserByIdWatch() {
  yield takeLatest(ACTION.GET_USER_BY_ID, getUserByIdSaga);
}

export function* getAllUsersByWorkspaceWatch() {
  yield takeLatest(ACTION.MANAGE_USERS_GETALL, getAllUsersByWorkspaceSaga);
}



export function* updateAvailabilityWatch() {
  yield takeLatest(ACTION.AVAILABILITY_SET, updateAvailabilitySaga);
}


