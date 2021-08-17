import { ACTION as types } from 'common/constants';

export default function(state = {}, action = {}) {
  const shouldRe_fetchNotes = action.shouldRe_fetchNotes || false;
  switch (action.type) {
    case types.RE_FETCH_NOTES:
      return { ...state, shouldRe_fetchNotes };
    default:
      return state;
  }
}
