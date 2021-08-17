import { availability, chat } from './chatReducer';
import { getConversationHistoryReducer as conversationHistory, selectedRoom as roomStore, selectedRoomRoomId as roomId } from './roomReducer';

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import inbox from './inboxReducer';
import login from './loginReducer';
import manage from './manageReducer';
import signin from './signinReducer';
import signup from './signupReducer';
import user from './userReducer';
import infoPanel from './infoPanel';

//combine all room related reducers
// const roomStore = combineReducers({
//   conversationHistory,
//   selectedRoom,
// });

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    signin,
    login,
    signup,
    user,
    inbox,
    availability,
    chat,
    conversationHistory,
    roomStore,
    roomId,
    manage,
    infoPanel
  });

export default rootReducer;
