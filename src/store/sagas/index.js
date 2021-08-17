import {
  getAllUsersByWorkspaceWatch,
  getConversationHistoryWatch,
  setSeletedRoomWatch,
  watchForgotPasswordCheck,
  watchGetInboxUsers,
  watchGetUserProfileDetails,
  watchSetPassword,
  watchSignup,
  watchSignup2,
  watchSignup3,
  watchSignup4,
  watchSignup5,
  watchUpdateUserProfileDetails,
  watchUserLogin,
  watchUserLogout,
  watchChangePassword,
  watchWorkspaceSignin,
  getSearchResultsWatch,
  getTaggedConversationsWatch,
  getStarredConversationsWatch,
  getMutedConversationsWatch,
  getDirectConversationsWatch,
  getChannelConversationsWatch,
  updateAvailabilityWatch
} from './watchers';

// import { WatchSocketSagas } from './chatSaga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    watchWorkspaceSignin(),
    watchUserLogin(),
    watchChangePassword(),
    watchUserLogout(),
    watchForgotPasswordCheck(),
    watchGetUserProfileDetails(),
    watchSetPassword(),
    watchSignup(),
    watchSignup2(),
    watchSignup5(),
    watchSignup3(),
    watchSignup4(),
    watchUpdateUserProfileDetails(),
    // WatchSocketSagas(),
    watchGetInboxUsers(),
    setSeletedRoomWatch(),
    getConversationHistoryWatch(),
    getAllUsersByWorkspaceWatch(),
    getSearchResultsWatch(),
    getStarredConversationsWatch(),
    getMutedConversationsWatch(),
    getTaggedConversationsWatch(),
    getDirectConversationsWatch(),
    getChannelConversationsWatch(),
    updateAvailabilityWatch()
  ]);
}
