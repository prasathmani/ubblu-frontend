import { ACTION as types } from 'common/constants';

export default function (state = {}, action = {}) {
  const response = action.response;

  switch (action.type) {
    case types.GET_USER_PROFILE_SUCCESS:
      return { ...state, response };
    case types.UPDTAE_USER_PROFILE_SUCCESS:
      return { ...state, response };

    case types.CHANGE_PASSWORD_SUCCESS:
      return { ...state, response };
    case types.CHANGE_PASSWORD_ERROR:
      return { ...state, response };

    default:
      return state;
  }
}
