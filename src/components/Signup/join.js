import React from 'react';

import { ROUTES } from 'common/constants';
import { getURLParameter } from 'common/utils';
import { isUserExist } from 'store/api';

const _email = getURLParameter('email');
const _token = getURLParameter('token');
const _url = window.location.search;

function checkEmailIsExist(email) {
  const payload = { email: email };
  isUserExist(payload)
    .then(response => {
      if (response.success && response.data.status === 1) {
        window.location.assign(ROUTES.LOGIN + _url);
      } else {
        window.location.assign(ROUTES.SIGNUP_INVITED + _url);
      }
    })
    .catch(error => {
      window.location.assign(ROUTES.SIGNUP_INVITED + _url);
    });
}

function InviteJoin() {
  if (_email && _token && _url) {
    checkEmailIsExist(_email);
  }

  return <h3>Loading...</h3>;
}

export default InviteJoin;
