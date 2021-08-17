import { USERID } from 'common/utils/helper';

//get user details using user id
const getUserDetails = (inboxList, uid) => {
  return inboxList.filter(function(user) {
    return user._id === uid;
  });
};

//update inbox with latest messages and sorting
export const syncInboxWithChat = (updateInboxList, inboxList = [], messages = [], currentRoomId = null) => {
  let msgItem, msgLastItem, matchingUser, __count, __userId, __inboxObj, __replied;
  console.log('utils messages sync', messages);
  Object.keys(messages).forEach(roomId => {
    console.log('utils room id', roomId, messages[roomId]);
    msgItem = messages[roomId];
    console.log('utils',msgItem.length - 1, msgItem )
    msgLastItem = msgItem[msgItem.length - 1];
    // msgLastItem = msgItem;
    if (msgLastItem.sender_id) {
      __userId = USERID() === msgLastItem.sender_id ? msgLastItem.receiver_id : msgLastItem.sender_id;
      __replied = USERID() === msgLastItem.sender_id ? true : false;
      matchingUser = getUserDetails(inboxList, __userId);
      __count =
        msgLastItem.sender_id !== USERID() && msgLastItem.sender_id !== currentRoomId ? matchingUser[0].unread + 1 : 0;

      if (matchingUser.length && matchingUser[0].messageId !== msgLastItem.id) {
        __inboxObj = {
          unread: __count,
          replied: __replied,
          message: msgLastItem.message,
          messageId: msgLastItem.id,
          date: msgLastItem.sentAt || new Date().getTime(),
        };
        updateInboxList(matchingUser[0]._id, __inboxObj);
      }
    }
  });
  return true;
}; 
