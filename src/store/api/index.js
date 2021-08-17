import { API } from 'common/constants';
import axios from 'axios';
import { get } from 'lodash';
import { getCookie } from 'common/utils';
import { USERID } from 'common/utils/helper';


// const API_ENDPOINT = API.LOCAL_API_ENDPOINT;
const API_ENDPOINT = API.API_ENDPOINT;

const header = {
  'Content-Type': 'application/json',
};

/**
 *
 * @param {*} ctype
 * get the auth token from cookie
 */

function header_auth(ctype = 'application/json') {
  let header = {
    Authorization: getCookie('at'),
    'Content-Type': ctype,
  };

  return header;
}

axios.defaults.baseURL = API_ENDPOINT;
// axios.defaults.baseURL = API.LOCAL_API_ENDPOINT;

const fetchData = (method = 'get', url = '', data = null, auth = false) => {
  auth = auth ? header_auth() : header;
  const appurl = `${API_ENDPOINT}${url}`;
  return new Promise((res, rej) => {
    fetch(appurl, {
      method,
      body: method === 'get' ? null : data,
      headers: auth,
    }).then(response => {
      response.json().then(res).catch(rej);
    })
  })
};

//axios call
const sync = (method = 'get', url = '', data = null, auth = false) => {
  auth = auth ? header_auth() : header;


  return axios({
    method: method,
    withCredentials: true,
    url: url,
    data: data,
    headers: auth,
  })
    .then(res => {
      return res && Promise.resolve(res.data);
    })
    .catch(function (error) {
      console.log('response after login api', error, get(error, 'response'))

      return Promise.resolve(get(error, 'response.data'));
    });
};

//check workPlaceName
export function checkWorkPlaceName(payload) {
  return sync('post', '/verifyWorkspace', payload, false);
}

//Login
export function loginUser(payload) {
  return sync('post', '/login', payload, false);
}

//change-password
export function changePassword(payload) {
  // return sync('post', '/workspaces/2/users/84/changePassword', payload, true);
  return sync('post', `/workspaces/${getCookie('wid')}/users/${getCookie('uid')}/changePassword`, payload, true);
}

//Register new account using email id
export function registerEmail(payload) {
  return sync('post', '/verifyEmail', payload, false);
}

//signup step 1
export function signupStep1(payload) {
  return sync('post', '/register', payload, false);
}

//signup step 2 - create workspace
export function signupStep2(payload) {
  return sync('post', '/workspaces', payload, true);
}


// //signup step 3 and 4 - channelname and invite users
// export function signupStep3(payload) {
//   return sync('post', `/channels/workspace/${payload.workspaceId}`, payload, true);
// }

//signup step 3 and 4 - channelname and invite users
export function signupStep3(payload) {
  return sync('post', `/workspaces/${payload.workspaceId}/departments`, payload, true);
}

//signup step 4 - channelname and invite users
export function signupStep4(payload) {
  return sync('post', `/workspaces/${payload.workspaceId}/inviteUser`, payload, true);
}

//Invite users to workspace
export function inviteUsers2Workspace(payload) {
  let url = `/workspaces/${payload.workspaceId}/inviteUser`;
  if (payload.type && payload.type === 'employee') {
    url = `/workspaces/${payload.workspaceId}/inviteEmployee`;
  }
  return sync('post', url, payload, true);
}

//signup step 5 filnal
export function signupStep5(payload) {
  const workspaceId = JSON.parse(payload).workspaceId;
  return sync('post', `/workspaces/${workspaceId}/setMetadata`, payload, true);
}

//get user details by user id
export function getUserByIdAxios(id) {
  return sync('get', `/users/${id}`, null, true);
}

//check the availability of workspace name
export function checkWorkSpaceAbility(payload) {
  return sync('post', '/workspaces/checkAvailability', payload, true);
}

//Forgot Password Check POST
export function forgotPasswordCheck(payload) {
  payload = JSON.stringify(payload);
  return sync('post', '/forgotPassword', payload, false);
}

//Set New Password Check POST
export function setPassword(payload) {
  return sync('post', '/resetPassword', payload, false);
}

//check the email id is already exist in application
export function isUserExist(payload) {
  return sync('post', '/isUbbluUser', payload, false);
}

//Get user details
export function getUserProfileDetails(payload) {
  
  return sync('get', `/workspaces/${getCookie('wid')}/users/${getCookie('uid')}`, payload, true);
  //return sync('get', `/workspaces/${getCookie('wid')}/users/${payload.uid}`, payload, true);
}

//Get user details
export function getWorkspaces() {
  return sync('get', '/workspaces', null, true);
}

export function getWorkspacesById(payload) {
  return sync('get', `/workspaces/${payload.workspaceId}`, null, true);
}

export function updateFirebaseId(firebase_id) {
  const data = JSON.stringify({
    userid: USERID(),
    firebase_id
  });
  if (USERID()) {
    return fetchData('put', `/users/firebaseid/${USERID()}`, data, true)
  }
}

export function getMyDetails() {
  return fetchData('get', `/users/${USERID()} `, null, true);
}

export function getUserDetails(userid) {
  return fetchData('get', `/users/${userid} `, null, true);
}

//Get signle user details
export function setSeletedRoomAxios(payload) {
  // return sync('get', `/ messages / ${ getCookie('wid') } /directMessage/${ payload.id } `, payload, true);
  return sync('get', `http://www.mocky.io/v2/5da2b48a2f0000b859f419a7`, payload, true);
}

//get recent conversation
//http://www.mocky.io/v2/5d07348b300000b654051e13
export function getConversationHistoryAxios(payload) {
  return axios
    .get(`http://www.mocky.io/v2/5d07348b300000b654051e13`, {
      headers: header_auth(),
    })
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(function (error) {
      return Promise.resolve(error.response.data);
    });
}

//get recent conversation of a channel/room
export function getConversationHistory(payload) {
  return sync('get', `${API_ENDPOINT}/messages/${getCookie('wid')}/${payload}`, null, true);
}

//search messages in a channel or in direct conversation
export function getSearchOutput(data) {
  return sync('post', `${API_ENDPOINT}/messages/${getCookie('wid')}/search`, data.payload, true);
}

//change read status in a convo for a user
export function changeReadStatus(roomId) {
  return sync('put', `${API_ENDPOINT}/messages/${getCookie('wid')}/${roomId}/read`, null, true);
}

//change readTagged status in a convo for a user
export function changeReadTaggedStatus(channelId,senderId) {
 // /:workspaceId/:channelId/:userId/:senderId/readTagged
  return sync('post', `${API_ENDPOINT}/messages/${getCookie('wid')}/${channelId}/${getCookie('uid')}/${senderId}/readTagged`, null, true);
}

//get tagged conversations for a user
export function listTaggedConversations(userId) {
  return sync('get', `${API_ENDPOINT}/messages/${getCookie('wid')}/${userId}/tagged`, null, true);
}




//upload images to aws bucket
export function uploadImages(payload) {
  return axios
    .post('users/uploadProfile', payload, {
      headers: header_auth('application/x-www-form-urlencoded'),
    })
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(function (error) {
      return Promise.resolve(error.response.data);
    });
}


//upload files to drive
export function uploadFiles(payload) {
  return axios
    .post('/uploadFile', payload, {
      headers: header_auth('application/x-www-form-urlencoded'),
    })
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(function (error) {
      console.log('error in file upload', error)
      return Promise.resolve(error.response);
    });
}



//download file
// export function downloadFile(msgId) {
//   return sync('get', `/file/download/${msgId}`, null, true);
// }


export function downloadFile(msgId) {
  return axios
    .get(`/file/download/${msgId}`, {
      responseType: 'blob',
      headers: {
        Authorization: getCookie('at'),
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(function (error) {
      console.log('error in file upload', error)
      return Promise.resolve(error.response);
    });
}

//get recent messages to a user from all other users
export function getInboxUsersAxios(workspaceId, userId) {
  // return workspaceId && sync('get', `/messages/${workspaceId}/listing`, null, true);
  // return workspaceId && sync('get', `http://www.mocky.io/v2/5d9d8b2f310000153650e2cd`, null, true);
  return sync('get', `/workspaces/${getCookie('wid')}/${userId}/users/recent/messages`, null, true);
}

//get latest messages to a user to be displayed in the inbox view
export function getLatestInboxMsgDetails(msgId, receiverId) {
  // return workspaceId && sync('get', `/messages/${workspaceId}/listing`, null, true);
  // return workspaceId && sync('get', `http://www.mocky.io/v2/5d9d8b2f310000153650e2cd`, null, true);
  return sync('get', `/workspaces/${getCookie('wid')}/${receiverId}/user/inbox/message/${msgId}`, null, true);
}



//get recent messages to a user from all other users
export function getDirectInboxUsersAxios(payload) {
  console.log('direct', payload.userId);
  // return workspaceId && sync('get', `/messages/${workspaceId}/listing`, null, true);
  // return workspaceId && sync('get', `http://www.mocky.io/v2/5d9d8b2f310000153650e2cd`, null, true);
  return sync('get', `/workspaces/${getCookie('wid')}/${payload.userId}/users/direct/recent/messages`, null, true);
}


//get recent messages to a user from all other users
export function getChannelInboxUsersAxios(payload) {
  // return workspaceId && sync('get', `/messages/${workspaceId}/listing`, null, true);
  // return workspaceId && sync('get', `http://www.mocky.io/v2/5d9d8b2f310000153650e2cd`, null, true);
  return sync('get', `/workspaces/${getCookie('wid')}/${payload.userId}/users/channel/recent/messages`, null, true);
}

//Update user profile Check POST
export function updateUserProfileDetails(payload) {
  return sync('put', '/users', payload, true);
}

//Get all list of departments by workspace id
export function getDepartments(workspaceId) {
  return sync('get', `/workspaces/${workspaceId}/departments`, null, true);
}

/**
 *
 * @param {Object} payload
 * add or edit or delete the department
 */
export function manageDepartment(payload) {
  let url = `/workspaces/${payload.workspaceId}/departments`;
  let method = 'post';
  if (payload && payload.id) {
    url = `/workspaces/${payload.workspaceId}/departments/${payload.id}`;
    if (payload.edit) {
      method = 'put';
    } else if (payload.delete) {
      method = 'delete';
    }
  }
  return sync(method, url, payload, true);
}

export const addUsers2Department = payload => {
  return sync('post', `/workspaces/${payload.workspaceId}/departments/${payload.departmentId}/addUsers`, payload, true);
};

//Get all list of users in the workspace
export function getAllUsers() {
  return sync('get', `/workspaces/${getCookie('wid')}/users`, null, true);
}

//google sign in
export function googleSignIn() {
  return sync('get', `/messages/google/signIn`, null, true);
}

//Get all list of non-members in the channel
export function getUsersOfWorkspace(channelId) {
  return sync('get', `/workspaces/${getCookie('wid')}/users`, null, true);
}

export function getOtherUsersOfWorkspace(channelId) {
  return sync('get', `/workspaces/${getCookie('wid')}/otherUsers`, null, true);
}

//Add new user from manage user
export function AddNewUser(payload) {
  return sync('POST', `/workspaces/${payload.workspaceId}/users`, payload, true);
}

//Get all list of users in the workspace
export function ManageUsers(payload) {
  return sync('put', `/users/${payload.userId}`, payload, true);
}

export function ManageUserDeactivate(payload) {
  return sync('post', `/users/suspend/${payload.userId}`, payload, true);
}

export function updateExceptionlist(payload) {
  payload = {
    ...payload,
    exceptionerid: getCookie('uid'),
    workspace_id: getCookie('wid')
  }
  return fetchData('post', '/users/exceptionlist', JSON.stringify(payload), true);
}

export function getExceptionlist() {
  return fetchData('get', `/users/exceptionlist/${getCookie('wid')}/${getCookie('uid')}`, null, true);
}

export function ManageUserReactivate(payload) {
  return sync('post', `/users/resume/${payload.userId}`, payload, true);
}

export function ManageUserTermination(payload) {
  return sync('post', `/users/terminate/${payload.userId}`, payload, true);
}

export function deleteUsers(payload) {
  return sync('post', '/users/suspendUsers', payload, true);
}

/**
 * get the list of channels by workspace
 * @param {Object} payload
 */
export function getNonSecretChannelsList() {
  return sync('get', `/workspaces/${getCookie('wid')}/channels`, null, true);
}

export function getAllChannels() {
  return sync('get', `/workspaces/${getCookie('wid')}/channels/list`, null, true);
}


export function getAllPublicChannels() {
  return sync('get', `/workspaces/${getCookie('wid')}/channels/public`, null, true);
}


/**
 * Add new channel to workspace
 * @param {Object} payload
 */
export function addNewChannel(payload) {
  return sync('post', `/workspaces/${payload.workspaceId}/channels`, payload, true);
}

/**
 * Add new users to channel
 * @param {Object} payload
 */
export function addUsers2Channel(payload) {
  return sync('post', `/channels/${payload.channelId}/members`, payload, true);
}

/**
 * Get all the users by channel id
 * @param {Object} payload
 */
export function getAllUsersByChannel(payload, useFetch = false) {
  if (useFetch) {
    return fetchData('get', `/channels/${payload.channelId}/users`, null, true);
  } else {
    return sync('get', `/channels/${payload.channelId}/users`, null, true);
  }
}

export function findWorkspace(payload, useFetch = false) {
  if (useFetch) {
    return fetchData('post', '/forgotWorkspace', payload, true);
  } else {
    return sync('get', '/forgotWorkspace', payload, true);
  }
}

/**
 * Delate user from channel
 * @param {Object} payload
 */
export function deleteUserFromChannel(payload) {
  return sync('delete', `/channels/${payload.channelId}/user/${payload.userId}`, null, true);
}

/**
 * Update channel
 * @param {Object} payload
 */
export function updateChannel(payload) {
  return sync('put', `workspaces/${payload.workspaceId}/channels/${payload.channelId}`, payload, true);
}

export function getWorkspaceUsersRelationToAChannel(workspaceId, channelId) {
  return sync('get', `workspaces/${workspaceId}/channels/users/${channelId}`, null, true);
}

/**
 * Make user as a admin
 * @param {Object} payload
 */
export function makeChannelAdmin(payload) {
  return sync('put', `/channels/${payload.channelId}/makeAdmin/${payload.userId}`, null, true);
}

/**
 * Delete the channel
 * @param {Object} payload
 */
export function deleteChannel(payload) {
  return sync('delete', `/channels`, payload, true);
}

/**
 * Get all my workspace
 */
export function getMyWorkspace() {
  return sync('get', `/workspaces`, null, true);
}

/**
 * Enable signup for workspace
 * @param {Object} payload
 */
export function registerOptions(payload) {
  return sync('post', `/workspaces/${payload.workspaceId}/registerOption`, payload, true);
}

/**
 * Search users by user full name
 * @param {Object} payload
 */
export function searchUsersByName(payload) {
  return sync('post', `/workspaces/${payload.workspaceId}/user/search`, payload, true);
}

//update workspace registration settings
export function updateWorkspaceRegistrationSettings(payload) {
  return sync('put', `/workspaces/${payload.workspaceId}/register/settings`, payload, true);
}


//fetch workspace registration settings
export function fetchWorkspaceRegistrationSettings() {
  return sync('get', `/workspaces/${getCookie('wid')}/register/settings`, null, true);
}


/**
 * Manage the email notification
 * @param {Object} payload
 */
export function manageEmailNotification(payload) {
  return sync('post', `/workspaces/${payload.workspaceId}/notificationSettings`, payload, true);
}


export function listStarredConversations(payload) {
  console.log('payload in tag', payload)
  return sync('get', `/channels/${getCookie('wid')}/${payload.payload}/starred`, null, true);

}

export function listMutedConversations(payload) {
  return sync('get', `/channels/${getCookie('wid')}/${payload.payload}/muted`, null, true);

}

export function handleKeywords(keywords, get = false) {
  const url = `/workspaces/${getCookie('wid')}/users/${getCookie('uid')}/keywords`;
  if (get) {
    return sync('get', url, null, true);
  } else {
    return sync('put', url, { keywords }, true);
  }
}


//create starred convo

export function createStarredConversations(channelId, userId) {
  return sync('post', `/channels/${channelId}/${userId}/star`, null, true);
}

export function createMutedConversations(payload) {
  return sync('post', `/channels/${getCookie('uid')}/mute`, payload, true);

}

// Create pin in convo
export function createPinnedConversations(channelId, userId) {
  return sync('post', `/channels/${channelId}/${userId}/pin`, null, true);
}

//channel notes and user details related
export function fetchUserDetailsById(userId, useFetch = false) {
  if (useFetch) {
    return fetchData('get', `/workspaces/${getCookie('wid')}/users/${userId}`, null, true);
  } else {
    return sync('get', `/workspaces/${getCookie('wid')}/users/${userId}`, null, true);
  }
}

export function addChannelNotes(payload) {
  return sync('post', `/channels/${payload.channelId}/addNotes`, payload, true);
}

export function updateChannelNotes(payload) {
  return sync('put', `/channels/${payload.channelId}/notes/${payload.id}`, payload, true);
}

export function fetchChannelNotes(channelId) {
  return sync('get', `/channels/${channelId}/notes`, null, true);
}

export function deleteNotes(channelId, noteId) {
  return fetchData('delete', `/channels/${channelId}/notes/${noteId}`, null, true);
}
//---------parmanentaly remove-------
export function removeNotes(channelId, noteId) {
  return fetchData('delete', `/channels/${channelId}/notes/${noteId}/remove`, null, true);
}

export function fetchChannelInformation(channelId, useFetch = false) {
  if (useFetch) {
    return fetchData('get', `/channels/${channelId}`, null, true);
  } else {
    return sync('get', `/channels/${channelId}`, null, true);
  }
}


export function joinChannelViaInvite(payload) {
  return sync('post', `/channels/join`, payload, true);
}


export function fetchCommonChannelsBetweenUsers(userId) {
  return sync('get', `/channels/${getCookie('wid')}/fetchCommon/${userId}`, null, true);
}

export function fetchChannelRoleForUser(userId, channelId) {
  return sync('get', `/channels/${channelId}/user/${userId}`, null, true);
}

export function fetchSharedFiles(channelId) {
  return sync('get', `/channels/${channelId}/files`, null, true);
}


export function changeChannelType(channelId) {
  return sync('put', `/channels/${channelId}/channelType`, null, true);
}


export function fetchChannelsForUser(userId) {
  return sync('get', `/channels/${getCookie('wid')}/${userId}/list`, null, true);
  //return sync('get', `/channels/${getCookie('wid')}/${userId}/list`, null, true);
}


export function unjoinChannel(channelId) {
  return sync('delete', `/channels/${channelId}/unjoin`, null, true);
}

export function searchChannelByName(payload) {
  return sync('post', `/channels/search`, payload, true);
}


export function searchUsersChannelByName(payload) {
  return sync('post', `/channels/list/search`, payload, true);
}



//change user DND mode in a workspace

//check the availability of workspace name
export function changeAvailabilityStatus(payload) {
  return sync('put', `/workspaces/${getCookie('wid')}/users/availability`, payload.payload, true);
}


//change  the availability(online/offline) status of a user
export function toggleUserOnlineStatus(userId) {
  return sync('put', `/workspaces/${getCookie('wid')}/users/${userId}/status`, null, true);
}

export function triggerNotification(payload) {
  return sync('post', `/users/triggerPushNotification`, payload, true);
}











