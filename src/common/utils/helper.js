import Cookies from 'js-cookie';
import { API } from '../constants';
import _clone from 'lodash/clone'
import _uniqBy from 'lodash/uniqBy'
import { getCookie , deleteAllCookies } from 'common/utils';

//Route Helpers
/**
 * Retrun current workspace id
 */
export const WORKSPACEID = () => {
  let wid = getCookie('wid') || window.location.pathname.split('/')[1];
  if (wid) {
    return parseInt(wid);
  }
  return null;
};

//get current login user unique id
export const USERID = () => {
  return getCookie('uid') || null;
};

/**
 * Logout
 */
export const CLEAR_SESSION = () => {
    localStorage.clear();
    deleteAllCookies();

  // Cookies.remove('at');
  // Cookies.remove('uid');
  // Cookies.remove('wid');
};

export const generateProfileUrl = (name, colors) => {
  let url = '';
  colors = colors ? colors : randomColorCode();
  try {
    let codes = colors.split(" ");
    let updatedName = name.split(" ").join("+");
    url = `${API.AVATAR}?name=${updatedName}&background=${codes[0]}`

  } catch (error) {
    //console.info('ERROR AVATAR URL', name, colors, 'MESSAGE', error.message);
  } finally {
    return url;
  }
}

export const generateChannelUrl = (colors) => {
  let url = '', codes = '';
  try {
    colors = colors ? colors : randomColorCode();
    codes = colors.split(" ");
    url = `${API.AVATAR}?name=%23&background=${codes[0]}`

  } catch (error) {
   // console.info('ERROR AVATAR URL', error.message);
  } finally {
    return { backgroundColor: `#${codes[1]}` };
  }
}


export function getUsersFromTags(text) {
  let displayText = _clone(text)
  const tags = text.match(/@\{\{[^\}]+\}\}/gi) || []
  const allUserIds = tags.map(myTag => {
    const tagData = myTag.slice(3, -2)
    const tagDataArray = tagData.split('||')
    return { _id: tagDataArray[1], name: tagDataArray[2] }
  })
  return _uniqBy(allUserIds, myUser => myUser._id)
}

export const randomColorCode = (hex, lum) => {
  let letters = 'BCDEF'.split(''),
    color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};