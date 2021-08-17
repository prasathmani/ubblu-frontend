import { ACTION as types } from 'common/constants';

export default function (state = {}, action = {}) {
  const response = action.response;

  switch (action.type) {
    case types.INBOX_USER_LIST_RESPONSE:
      const recents = response && response.data;
      state.clearInbox = false;
      state._search = {};
      state._channel = {};
      state._direct = {};
      state._starred = {};
      state._muted = {};
      return { ...state, recents, };

    case types.CLEAR_INBOX_USER_LIST:
      const clearInbox = true;
      return { ...state, clearInbox, };

    case types.DIRECT_MESSAGES_SUCCESS:
      const _direct = response && response.data;
      state.clearInbox = false;

      return { ...state, _direct };

    case types.CLEAR_DIRECT_MESSAGES:
      state._direct = {};
      state.clearInbox = false;

      return { ...state };

    case types.CHANNEL_MESSAGES_SUCCESS:
      const _channel = response && response.data;
      state.clearInbox = false;

      return { ...state, _channel };

    case types.CLEAR_CHANNEL_MESSAGES:
      state._channel = {};
      state.clearInbox = false;

      return { ...state };

    case types.SEARCH_MESSAGES_SUCCESS:
      const _search = response && response.data;
      state.clearInbox = false;

      return { ...state, _search };

    case types.CLEAR_SEARCH_MESSAGES:
      state._search = {};
      state.clearInbox = false;

      return { ...state };

    case types.TAGGED_MESSAGES_SUCCESS:
      const _tagged = response && response.data;
      state.clearInbox = false;

      return { ...state, _tagged };

    case types.CLEAR_TAGGED_MESSAGES:
      state._tagged = {};
      state.clearInbox = false;

      return { ...state };

    case types.STARRED_MESSAGES_SUCCESS:
      const _starred = response && response.data;
      state.clearInbox = false;

      return { ...state, _starred };

    case types.CLEAR_STARRED_MESSAGES:
      state._starred = {};
      state.clearInbox = false;

      return { ...state };

    case types.MUTED_MESSAGES_SUCCESS:
      const _muted = response && response.data;
      state.clearInbox = false;

      return { ...state, _muted };

    case types.CLEAR_MUTED_MESSAGES:
      state._muted = {};
      state.clearInbox = false;

      return { ...state };
    default:
      return state;
  }
}  
