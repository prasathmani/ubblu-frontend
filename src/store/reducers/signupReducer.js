import { ACTION } from 'common/constants';

export default function(state = {}, action = {}) {
  const response = action.response;

  switch (action.type) {
    case ACTION.SIGNUP_1_SUCCESS:
      return { ...state, signIn: true, shouldRedirect: true, response };
    case ACTION.SIGNUP_1_ERROR:
      return { ...state, signIn: false, shouldRedirect: false, response };
    case ACTION.SIGNUP_2_RESPONSE:
      return { ...state, response };
    case ACTION.SIGNUP_3_RESPONSE:
      return { ...state, response };
    case ACTION.SIGNUP_4_RESPONSE:
      return { ...state, response };
    case ACTION.SIGNUP_5_RESPONSE:
      return { ...state, response };
    default:
      return state;
  }
}
