import { ACTION as types } from 'common/constants';

export default function(state = {}, action = {}) {
  const response = action.response;

  switch (action.type) {
    case types.MANAGE_USERS_GETALL_RES:
      return { ...state, response };
    case types.TOGGELE_SCREEN:
      return {...state, screen: action.screen};
    case types.FULL_SCREEN:
      return {...state, fullScreen: action.fullScreen};
    default:
      return state;
  }
}
