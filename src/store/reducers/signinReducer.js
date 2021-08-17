import { ACTION as types } from 'common/constants';

export default function(state = {}, action = {}) {
  const response = action.response;

  switch (action.type) {
    case types.SIGNIN_WORKSPACE_RESPONSE:
      return { ...state, response };
    default:
      return state;
  }
}
