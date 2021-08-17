import { USERID } from 'common/utils/helper';
import { ACTION as types } from 'common/constants';

//chat reducer
export function availability(state = {}, action = {}) {
  const response = action;

  switch (action.type) {
    case types.AVAILABILITY_GET:
      return { ...state, response };
    case types.AVAILABILITY_SET_SUCCESS:
      const availability = response && response.data;
      return { ...state, availability };
    default:
      return state;
  }
}

//chat reducer
export function chat(state = {}, action = {}) {
  const response = action;
  const currentUserId = USERID();

  switch (action.type) {
    case types.CHAT_RECEIVE_MESSAGE:
      const receiverId =
        response.receiverId && currentUserId === response.receiverId ? response.senderId : response.receiverId;
      if (state && state.messages && state.messages[receiverId]) {
        state.messages[receiverId].push(response);
        return { ...state };
      } else {
        if (state.messages) {
          state.messages[receiverId] = [response];
          return { ...state };
        } else {
          let messages = {};
          messages[receiverId] = [response];
          return { ...state, messages };
        }
      }




    default:
      return state;
  }
}
