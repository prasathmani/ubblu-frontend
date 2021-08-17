export const checkCookies = name =>{
  if(localStorage.getItem(name)==='false'){
    //localStorage.setItem('ubblu-app', "s%3Ag5v29dCJFvrksWOQ1GKBG9JL6f1QM-9a.XkPH55N58opq8uY0RXZTscE7fl8KxaKpu%2B4YHN07uxM", 1); 
    return 'localStorage'
  }
  else{
    const results = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    
    return results ? "cookies" : null;
  }


}

/**
 @method getCookie
 @param {string} name
 */
export const getCookie = name => {
  var cookies_value= checkCookies('is_cookie');
 

  if(cookies_value==='localStorage'){
    return localStorage.getItem(name);
  }
  else if(cookies_value==='cookies'){
    const results = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return results ? decodeURIComponent(results[2]) : null;
  }
  else{
    const results = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return results ? decodeURIComponent(results[2]) : null;
  }

  //const results =localStorage.getItem().match(`(^|;) ?${name}=([^;]*)(;|$)`);
  //return results ? decodeURIComponent(results[2]) : null;
  
};

/**
   @method setCookie
   @param {string} name
   @param {string} value
   @param {object} opts
   */
export const setCookie = async(name, value, opts) => { 
  let cookies_value=checkCookies('is_cookie');

  if(cookies_value==="localStorage"){

    localStorage.setItem(name, value, 1)
  
  }
  else{
      let cookieStr = `${name}=${escape(value)}`;
      const options = {
        expiryDays: 365,
        path: '/',
        SameSite: 'Strict',
        ...opts,
      };

      if (options.expiryDays !== 0) {
        const date = new Date();
        date.setDate(date.getDate() + options.expiryDays);
        cookieStr += `; expires=${date.toGMTString()}`;
      }
      if (options.domain) {
        cookieStr += `; domain=${options.domain}`;
      }

      document.cookie = `${cookieStr}; path=${options.path}`;
 }
  
  
  
};
export function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  console.log("Cookies",cookies);
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      console.log("Cookies",name);
      deleteCookie(name);
      //document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
     // console.log("Cookies",cookies);
  }
}

/**
   @method deleteCookie
   @param {string} name
   @param {string} pathValue
   */
export const deleteCookie = (name, pathValue, domainName) => {
  let options = {
    expiryDays: -1,
  };

  if (pathValue) {
    options.pathValue = pathValue;
  }
  if (domainName) {
    options.domain = domainName;
  }
  setCookie(name, '', options);
};

/**
 *
 * @param key session storage key name
 * @param cookie cookie name used for fallback
 * @return {any}
 */
export const getFromSession = (key, cookie, win = window) => {
  if (win && win.sessionStorage) {
    const data = win.sessionStorage.getItem(key);
    if (!data) {
      return JSON.parse(getCookie(cookie));
    }
    /* jest ignore else */
    return JSON.parse(data);
  }
};
/**
 *
 *
 * @param {any} data
 * @param {any} key
 * @param {any} [win=window]
 * @returns
 */
export const saveToLocalStorage = (data, key, win = window) => {
  let success = false;
  const dta = typeof data === 'object' ? JSON.stringify(data) : data;
  if (win && win.localStorage) {
    win.localStorage.setItem(key, dta);
    success = true;
  }
  return success;
};

/**
 * save sessionStorage data by key
 * * @param {String} key
 * * @param {Object} data
 */
export const saveToSession = (data, key, win = window) => {
  let success = false;
  if (win && win.sessionStorage) {
    win.sessionStorage.setItem(key, JSON.stringify(data));
    success = true;
  }
  return success;
};

/**
 *
 * @param key session storage key name
 * @param cookie cookie name used for fallback
 * @return {any}
 */
export const deleteFromSession = (key, win = window) => {
  if (win && win.sessionStorage) {
    win.sessionStorage.removeItem(key);
    return 'deleted';
  }
};
/**
 *
 *
 * @param {any} sessionItems
 */
export const clearSessionStorage = sessionItems => {
  sessionItems.forEach(item => {
    deleteFromSession(item);
  });
};
/**
 *
 *
 * @param {any} cookies
 * @param {any} sessionItems
 */
export const clearCookiesAndSession = (cookies, sessionItems) => {
  clearSessionStorage(sessionItems);

  cookies.forEach(item => {
    deleteCookie(item);
  });
};

/**
 *
 *
 * @param {string} name
 */
// eslint-disable-next-line
export const getURLParameter = name => {
  return (
    decodeURIComponent(
      // eslint-disable-next-line
      (new RegExp(`[?|&]${name}=` + `([^&;]+?)(&|#|;|$)`).exec(window.location.search) || [null, ''])[1].replace(
        /\+/g,
        '%20',
      ),
    ) || null
  );
};

/**
 * Get domain name to set cookies
 * @param {string} name
 */
// eslint-disable-next-line
export const getDomainName = () => {
  let hostName = window.location.hostname;
  return hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
};

/**
 * Get domain name to set cookies commonly for
 * domain and sub-domains
 */
// eslint-disable-next-line
export const getDomainNameToSetCookies = () => {
  let hostName = window.location.hostname;
  return '.' + hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
};

//ellipsed text
export const textEllipsis = (text, max) => {
  if (text && max) {
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
  } else {
    return text || '';
  }
};

// Note ellipsed text
export const textNoteEllipsis = text => {
  if(text){
    if (text.length >= 80) {
      return text.substr(0,80 - 1) + (text.length > 80 ? '...' : '');
    } else {
      return text.substr(0,80 -1 ) + (text.length > 80 ? '...' : '');
    }
  }
}
//get subdomain name form url
export const getSubdomain = hostname => {
  const regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
  let urlParts = regexParse.exec(hostname);
  return hostname.replace(urlParts[0], '').slice(0, -1);
};

//get current login user unique id
export const getLoginUserId = () => {
  let cookies_value=checkCookies('is_cookie');

  if(cookies_value==="localStorage"){

   return localStorage.getItem('uid')
  
  }
  else{
  let results = document.cookie.match(`(^|;) ?uid=([^;]*)(;|$)`);
  results = results && decodeURIComponent(results[2]);
  return results && parseInt(results);
  }
};

// Taken from http://stackoverflow.com/questions/1068834/object-comparison-in-javascript and modified slightly
export function areObjectsEqual(x, y) {
  let p;
  const leftChain = [];
  const rightChain = [];

  // Remember that NaN === NaN returns false
  // and isNaN(undefined) returns true
  if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
    return true;
  }

  // Compare primitives and functions.
  // Check if both arguments link to the same object.
  // Especially useful on step when comparing prototypes
  if (x === y) {
    return true;
  }

  // Works in case when functions are created in constructor.
  // Comparing dates is a common scenario. Another built-ins?
  // We can even handle functions passed across iframes
  if (
    (typeof x === 'function' && typeof y === 'function') ||
    (x instanceof Date && y instanceof Date) ||
    (x instanceof RegExp && y instanceof RegExp) ||
    (x instanceof String && y instanceof String) ||
    (x instanceof Number && y instanceof Number)
  ) {
    return x.toString() === y.toString();
  }

  if (x instanceof Map && y instanceof Map) {
    return areMapsEqual(x, y);
  }

  // At last checking prototypes as good a we can
  if (!(x instanceof Object && y instanceof Object)) {
    return false;
  }

  if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
    return false;
  }

  if (x.constructor !== y.constructor) {
    return false;
  }

  if (x.prototype !== y.prototype) {
    return false;
  }

  // Check for infinitive linking loops
  if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
    return false;
  }

  // Quick checking of one object being a subset of another.
  for (p in y) {
    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
      return false;
    } else if (typeof y[p] !== typeof x[p]) {
      return false;
    }
  }

  for (p in x) {
    //eslint-disable-line guard-for-in
    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
      return false;
    } else if (typeof y[p] !== typeof x[p]) {
      return false;
    }

    switch (typeof x[p]) {
      case 'object':
      case 'function':
        leftChain.push(x);
        rightChain.push(y);

        if (!areObjectsEqual(x[p], y[p])) {
          return false;
        }

        leftChain.pop();
        rightChain.pop();
        break;

      default:
        if (x[p] !== y[p]) {
          return false;
        }
        break;
    }
  }

  return true;
}

export function areMapsEqual(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  // eslint-disable-next-line
  for (const [key, value] of a) {
    if (!b.has(key)) {
      return false;
    }

    if (!areObjectsEqual(value, b.get(key))) {
      return false;
    }
  }

  return true;
}

export function replaceHtmlEntities(text) {
  var tagsToReplace = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
  };
  var newtext = text;
  for (var tag in tagsToReplace) {
    if (Reflect.apply({}.hasOwnProperty, this, [tagsToReplace, tag])) {
      var regex = new RegExp(tag, 'g');
      newtext = newtext.replace(regex, tagsToReplace[tag]);
    }
  }
  return newtext;
}

export function insertHtmlEntities(text) {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  var newtext = text;
  for (var tag in tagsToReplace) {
    if (Reflect.apply({}.hasOwnProperty, this, [tagsToReplace, tag])) {
      var regex = new RegExp(tag, 'g');
      newtext = newtext.replace(regex, tagsToReplace[tag]);
    }
  }
  return newtext;
}

// Converts a file size in bytes into a human-readable string of the form '123MB'.
export function fileSizeToString(bytes) {
  // it's unlikely that we'll have files bigger than this
  if (bytes > 1024 * 1024 * 1024 * 1024) {
    return Math.floor(bytes / (1024 * 1024 * 1024 * 1024)) + 'TB';
  } else if (bytes > 1024 * 1024 * 1024) {
    return Math.floor(bytes / (1024 * 1024 * 1024)) + 'GB';
  } else if (bytes > 1024 * 1024) {
    return Math.floor(bytes / (1024 * 1024)) + 'MB';
  } else if (bytes > 1024) {
    return Math.floor(bytes / 1024) + 'KB';
  }

  return bytes + 'B';
}

// Generates a RFC-4122 version 4 compliant globally unique identifier.
export function generateId() {
  // implementation taken from http://stackoverflow.com/a/2117523
  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  id = id.replace(/[xy]/g, c => {
    var r = Math.floor(Math.random() * 16);

    var v;
    if (c === 'x') {
      v = r;
    } else {
      v = (r & 0x3) | 0x8;
    }

    return v.toString(16);
  });

  return id;
}

export function isEmptyObject(object) {
  if (!object) {
    return true;
  }

  if (Object.keys(object).length === 0) {
    return true;
  }

  return false;
}

export const isArray = data => {
  return Object.prototype.toString.call(data) === '[object Array]';
};

export function copyToClipboard(data) {
  // creates a tiny temporary text area to copy text out of
  // see https://stackoverflow.com/a/30810322/591374 for details
  var textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = data;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

export const addClass = (el, className) => {
  if (el.classList) el.classList.add(className);
  else el.className += ' ' + className;
};

//remove class from element
export const removeClass = ($el, className) => {
  console.log('replace',className. $el.length, $el)
  const _removeClass = function(el) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' ',
      );
    }
  };
  if ($el.length === 1) {
    _removeClass($el);
  } else if ($el.length > 1) {
    $el.forEach(function(item) {
      _removeClass(item);
    });
  }
};

// contenteditable, set caret at the end of the text (cross-browser)
// https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
export const setContenteditFocus = $el => {
  $el.focus();
  if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
    let range = document.createRange();
    range.selectNodeContents($el);
    range.collapse(false);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != 'undefined') {
    let textRange = document.body.createTextRange();
    textRange.moveToElementText($el);
    textRange.collapse(false);
    textRange.select();
  }
};

/**
 * get the file extension
 * @param {String} file
 */
export const getFileType = file => {
  if (!file) {
    return;
  }

  const lastDot = file.name.lastIndexOf('.');
  file.name.substring(0, lastDot);

  return file.name.substring(lastDot + 1);
};

export const serialize = form => {
  let serialized = [];
  for (let i = 0; i < form.elements.length; i++) {
    let field = form.elements[i];
    if (
      !field.name ||
      field.disabled ||
      field.type === 'file' ||
      field.type === 'reset' ||
      field.type === 'submit' ||
      field.type === 'button'
    )
      continue;
    if (field.type === 'select-multiple') {
      for (var n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.options[n].value));
      }
    } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
    }
  }
  return serialized.join('&');
};

export const isDesktopApp = () => {
  const platform = window.navigator;
  if (!!platform && platform.userAgent.indexOf('Electron') > -1) {
    return true;
  }
  return false;
}