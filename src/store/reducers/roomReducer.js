import { ACTION as types } from 'common/constants';

export function getConversationHistoryReducer(state = {}, action = {}) {
  const response = action;

  switch (action.type) {
    case types.CONVERSATION_HISTORY_SET:
      return { ...state, response };
    default:
      return state;
  }
}

export function selectedRoom(state = {}, action = {}) {
  const response = action;

  switch (action.type) { 
    case types.ROOM_CONVERSATION_VIEW:
      return { ...state, response };
    default:
      return state;
  }
}


export function selectedRoomRoomId(state = {}, action = {}) {
  const response = action;

  switch (action.type) { 
    case types.CHANNEL_ID:
      return { ...state, response };
    default:
      return state;
  }
}

