//Message Helper
import { WORKSPACEID } from 'common/utils/helper';

export function getRelativeChannelURL(channelName) {
  return `/${WORKSPACEID()}/channels/${channelName}/`;
}

export function getRelativeMessageURL(messageName) {
  return `/${WORKSPACEID()}/messages/${messageName}/`;
}

export function getManageChannelsURL() {
  return `/${WORKSPACEID()}/messages/channels/`;
}


//get Room name and Id form url
export function getRoomData() {  
  const location = window.location.href;
  let roomData = {
    roomType: null,
    roomId: null,
  };
 
  if (location.indexOf('/channels/') > -1) {
    roomData.roomType = 'channels';
    roomData.roomId = getRoomIdFromUrl();
  } else if (location.indexOf('/messages/') > -1) {
    roomData.roomType = 'messages';
    roomData.roomId = getRoomIdFromUrl();
  }
  return roomData;
}

//get the room id form url, last segment of a url
//TODO :: only return id next channel or message and length match
export function getRoomIdFromUrl() {
  // const location = window.location.href;
  // eslint-disable-next-line
  // return location.match(/([^\/]*)\/*$/)[1];
  //TODO :: refactor required
  return window.location.pathname.split('/')[3];
}

export const encodeEntities = value => {
  const SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
    // Match everything outside of normal chars and " (quote character)
    // eslint-disable-next-line
    NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
  /**
   * Escapes all potentially dangerous characters, so that the
   * resulting string can be safely inserted into attribute or
   * element text.
   * @param value
   * @returns {string} escaped text
   */
  return value
    .replace(/&/g, '&amp;')
    .replace(SURROGATE_PAIR_REGEXP, function(value) {
      let hi = value.charCodeAt(0);
      let low = value.charCodeAt(1);
      return '&#' + ((hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000) + ';';
    })
    .replace(NON_ALPHANUMERIC_REGEXP, function(value) {
      return '&#' + value.charCodeAt(0) + ';';
    })
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
/**
 @method format_link
 @param {string} text
 @returns formated message with img, link
 */
export const format_link = text => {
  // eslint-disable-next-line
  const urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdeghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
  return text.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
};

export const format_email = text => {
  // eslint-disable-next-line
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return text.replace(emailRegex, function(email) {
    return `<a href="mailto:${email}" target="_blank">${email}</a>`;
  });
};

export const linkify = text => {
  let replacedText, urlRegex, emailRegex;

  //URLs starting with http://, https://, or ftp://
  urlRegex = /(((https?|ftp|file:\/\/)|(www\.))[^\s]+)/gi;
  replacedText = text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

  //Change email addresses to mailto:: links.
  // eslint-disable-next-line
  emailRegex = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(emailRegex, '<a href="mailto:$1">$1</a>');

  return replacedText;
};

export const format_message = text => {
  let __txtMsg = encodeEntities(text);
  __txtMsg = linkify(__txtMsg);
  return __txtMsg;
};
