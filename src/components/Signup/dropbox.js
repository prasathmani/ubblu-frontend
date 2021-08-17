import React from 'react';
import { push } from 'connected-react-router';

import { ROUTES } from 'common/constants';
import store from 'store';

import dropbox from './assets/dropbox.png'
import gdrive from './assets/google_drive.webp'

import './dropbox.scss';

export default class DropBox extends React.Component {

    onPermissionAgreed = () => {
        const wid = window.location.search.split("?wid=")[1]
        let _url = ROUTES.SIGNUP_INVITE + '?wid=' + wid;
        store.dispatch(push(_url));
    }

    render() {
        return (
            <div className='dropbox' >
                <div className='dropbox--title' >
                    <h2>Drop Box</h2>
                    <p>
                        <span>
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                        Connect any one of accounts
                    </p>
                    <hr />
                </div>
                <div className="dropbox--logo" >
                    <img src={dropbox} onClick={this.onPermissionAgreed} alt="dropbox" />
                    <img src={gdrive} onClick={this.onPermissionAgreed} alt="gdrive" />
                </div>
            </div>
        )
    }
}
