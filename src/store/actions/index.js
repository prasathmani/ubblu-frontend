import { ACTION } from 'common/constants';

// Worker triggering actionCreators
export function loginUserAction(session, resolve, reject) {
  return { type: ACTION.LOGIN_USER, payload: session, resolve, reject };
}
export function logoutAction(session) {
  return { type: ACTION.LOGOUT_USER, payload: session || null };
}

// Change-Password
export function changePwdAction(session, resolve, reject) {
  return { type: ACTION.CHANGE_PASSWORD, payload: session, resolve, reject };
}

//workspace signin
export function signinWorkspaceWatcher(session, resolve, reject) {
  return { type: ACTION.SIGNIN_WORKSPACE, payload: session, resolve, reject };
}

//Signup step 1
export function signupWatcher1(session, resolve, reject) {
  return { type: ACTION.SIGNUP_1, payload: session, resolve, reject };
}

//Signup step 2 - workspace
export function signupWatcher2(session, resolve, reject) {
  return { type: ACTION.SIGNUP_2, payload: session, resolve, reject };
}

//Signup step 4 - invite to workspace
export function signupWatcher4(session, resolve, reject) {
  return { type: ACTION.SIGNUP_4, payload: session, resolve, reject };
}

//Signup step 3 and 3 - channel and invite
export function signupWatcher3(session, resolve, reject) {
  return { type: ACTION.SIGNUP_3, payload: session, resolve, reject };
}

//Signup step 5 - final step
export function signupWatcher5(session, resolve, reject) {
  return { type: ACTION.SIGNUP_5, payload: session, resolve, reject };
}

export function getUserProfileWatcher() {
  return { type: ACTION.GET_USER_PROFILE, payload: null };
}

export function clearSession() {
  return { type: ACTION.CLEAR_SESSION, payload: null };
}

export function forgotPwdAction(session, resolve, reject) {
  return { type: ACTION.FORGOT_PASSWORD, payload: session, resolve, reject };
}

export function setPasswordAction(session, resolve, reject) {
  return { type: ACTION.SET_PASSWORD, payload: session, resolve, reject };
}

export function getUserDataAction(session, resolve, reject) {
  return { type: ACTION.GET_USER_PROFILE, payload: session, resolve, reject };
}

export function updateUserProfileAction(session, resolve, reject) {
  return { type: ACTION.UPDATE_USER_PROFILE, payload: session, resolve, reject };
}

//Inbox - Get list of user
export function getInboxUsersAction(payload, resolve, reject) {
  return { type: ACTION.INBOX_USER_LIST, inbox: payload, resolve, reject };
}

//clear inbox list
export function clearInboxUsersAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_INBOX_USER_LIST, inbox: payload, resolve, reject };
}

export function setSeletedRoomAction(payload, resolve, reject) {
  return { type: ACTION.CHAT_SELECTED_ROOM, data: payload, resolve, reject };
}


export function setSeletedRoomRoomIdAction(payload, resolve, reject) {
  return { type: ACTION.CHANNEL_ID, data: payload, resolve, reject };
}

export function getConversationHistoryAction(payload, resolve, reject) {
  return { type: ACTION.CONVERSATION_HISTORY_GET, payload: payload, resolve, reject };
}

//Sockets 
export function setAvailability(payload, resolve, reject) {
  return { type: ACTION.AVAILABILITY_SET, payload: payload, resolve, reject };
}

export function sendMessageAction(payload, resolve, reject) {
  return { type: ACTION.CHAT_SEND_MESSAGE, payload: payload, resolve, reject };
}

export function receiveMessageAction(payload, resolve, reject) {
  return { type: ACTION.CHAT_RECEIVE_MESSAGE, payload: payload, resolve, reject };
}

export function getUserByIdAction(payload, resolve, reject) {
  return { type: ACTION.GET_USER_BY_ID, payload: payload, resolve, reject };
}

export function getAllUsersByWorkspaceAction(payload, resolve, reject) {
  return { type: ACTION.MANAGE_USERS_GETALL, payload: payload, resolve, reject };
}


export function getSearchResultsAction(payload, resolve, reject) {
  return { type: ACTION.SEARCH_MESSAGES, payload: payload, resolve, reject };
}

export function clearSearchResultsAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_SEARCH_MESSAGES, payload: payload, resolve, reject };
}


export function getTaggedConversationsAction(payload, resolve, reject) {
  return { type: ACTION.TAGGED_MESSAGES, payload: payload, resolve, reject };
}

export function clearTaggedConversationsAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_TAGGED_MESSAGES, payload: payload, resolve, reject };
}



export function getStarredConversationsAction(payload, resolve, reject) {
  return { type: ACTION.STARRED_MESSAGES, payload: payload, resolve, reject };
}

export function clearStarredConversationsAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_STARRED_MESSAGES, payload: payload, resolve, reject };
}


export function getMutedConversationsAction(payload, resolve, reject) {
  return { type: ACTION.MUTED_MESSAGES, payload: payload, resolve, reject };
}

export function clearMutedConversationsAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_MUTED_MESSAGES, payload: payload, resolve, reject };
}

export function getDirectConversationsAction(payload, resolve, reject) {
  return { type: ACTION.DIRECT_MESSAGES, userId: payload, resolve, reject };
}

export function clearDirectConversationsAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_DIRECT_MESSAGES, userId: payload, resolve, reject };
}

export function getChannelConversationsAction(payload, resolve, reject) {
  return { type: ACTION.CHANNEL_MESSAGES, userId: payload, resolve, reject };
}

export function clearChannelConversationsAction(payload, resolve, reject) {
  return { type: ACTION.CLEAR_CHANNEL_MESSAGES, userId: payload, resolve, reject };
}

export function setScreen(screen) {
  return { type: ACTION.TOGGELE_SCREEN, screen };
}

export function setFullScreen(fullScreen) {
  return { type: ACTION.FULL_SCREEN, fullScreen };
}

export function re_fetchNotes(shouldRe_fetchNotes) {
  return { type: ACTION.RE_FETCH_NOTES, shouldRe_fetchNotes };
}
