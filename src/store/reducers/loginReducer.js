import { ACTION as types } from 'common/constants';

export default function(state = {}, action = {}) {
  const response = action.response;

  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return { ...state, loggedIn: true, shouldRedirect: true, response };
    case types.LOGIN_USER_ERROR:
      return { ...state, loggedIn: false, shouldRedirect: true, response };
    case types.FORGOT_PWD_SUCCESS:
      return { ...state, response };
    case types.FORGOT_PWD_ERROR:
      return { ...state, response };
    case types.SET_PASSWORD_SUCCESS:
      return { ...state, response };
    case types.SET_PASSWORD_ERROR:
      return { ...state, response };
    default:
      return state;
  }
}
