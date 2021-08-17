import { NavLink, Route } from 'react-router-dom';
import { ROUTES } from 'common/constants';

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get as _get } from 'lodash';
import { getCookie, isDesktopApp } from 'common/utils';
let userDetails = null;
let userWorkspaceRelationship = null;

let menuItems = [
  {
    id: 0,
    title: 'Profile',
    selected: false,
    path: ROUTES.MANAGE_PROFILE,
  },
  { id: 1 ,
    title: 'Change Password',
    selected: false,
    path: ROUTES.MANAGE_CHANGE_PASSWORD,
  },
  {
    id: 2,
    title: 'Email Notifications',
    selected: false,
    path: ROUTES.MANAGE_EMAIL,
  },
  {
    id: 3,
    title: 'People',
    selected: false,
    path: ROUTES.MANAGE_USERS,
  },
  {
    id: 4,
    title: 'Channels',
    selected: false,
    path: ROUTES.MANAGE_CHANNELS,
  },
  // {
  //   id: 4,Email Noti
  //   title: 'Billing',
  //   selected: false,
  //   path: ROUTES.MANAGE_BILLING,
  // },
  {
    id: 5,
    title: 'Sign up Settings',
    selected: false,
    path: ROUTES.MANAGE_REGISTRATION,
  },{
    id: 6,
    title: 'Help',
    selected: false,
    path: ROUTES.MANAGE_HELP,
    isAnchorTag : true
  },
  {
    id: 7,
    title: 'Sign Out',
    selected: false,
    path: ROUTES.LOGOUT_ROUTE,
  },
  // {
  //   id: 6,
  //   title: 'Workspaces',
  //   selected: false,
  //   path: ROUTES.MANAGE_WORKSPACE,
  // },
];

const SubMenu = React.memo(props => {


  if (!getCookie('at')) {
    document.location.assign(ROUTES.LOGIN);
  } 
  
  if (_get(props, 'response')) {
    let user = props.response.user;
    if (_get(user, 'response')) {
      let userObject = user.response;
      if (_get(userObject, 'user')) {
        userDetails = userObject.user;
        userWorkspaceRelationship = userDetails.user_workspace_relationships.length ? userDetails.user_workspace_relationships[0]['status'] : null;
      }
    }
  }
  console.log('user details in side bar', userDetails)

  if (userWorkspaceRelationship && (userWorkspaceRelationship === 'ADMIN')) {
    menuItems = [
      {
        id: 0,
        title: 'Profile',
        selected: false,
        path: ROUTES.MANAGE_PROFILE,
      },
      { id: 1 ,
        title: 'Change Password',
        selected: false,
        path: ROUTES.MANAGE_CHANGE_PASSWORD,
      },
      {
        id: 2,
        title: 'Email Notifications',
        selected: false,
        path: ROUTES.MANAGE_EMAIL,
      },
      {
        id: 3,
        title: 'People',
        selected: false,
        path: ROUTES.MANAGE_USERS,
      },
      {
        id: 4,
        title: 'Channels',
        selected: false,
        path: ROUTES.MANAGE_CHANNELS,
      },
      {
        id: 5,
        title: 'Registration Settings',
        selected: false,
        path: ROUTES.MANAGE_REGISTRATION,
      },
      {
        id: 7,
        title: 'Help',
        selected: false,
        path: ROUTES.MANAGE_HELP,
        isAnchorTag : true
      },
      {
        id: 5,
        title: 'Sign Out',
        selected: false,
        path: ROUTES.LOGOUT_ROUTE,
      }
    ];

  }

  if (userWorkspaceRelationship && (userWorkspaceRelationship === 'EMPLOYEE' || userWorkspaceRelationship === 'GUEST USER')) {
    menuItems = [
      {
        id: 0,
        title: 'Profile',
        selected: false,
        path: ROUTES.MANAGE_PROFILE,
      },
      { id: 1 ,
        title: 'Change Password',
        selected: false,
        path: ROUTES.MANAGE_CHANGE_PASSWORD,
      },
      {
        id: 2,
        title: 'Email Notifications',
        selected: false,
        path: ROUTES.MANAGE_EMAIL,
      },
      {
        id: 7,
        title: 'Help',
        selected: false,
        path: ROUTES.MANAGE_HELP,
        isAnchorTag : true
      },
      {
        id: 3,
        title: 'Sign Out',
        selected: false,
        path: ROUTES.LOGOUT_ROUTE,
      }
    ];

  }

  return (
    <React.Fragment>
      <div className="sidebar_submenu">
        <ul className="sidebar_submenu_list">
          {menuItems.map(item => (
            <li key={item.id}>
              {item.isAnchorTag ?
                <a href={item.path} rel="noopener"  target="_blank">{item.title}</a> :
                <NavLink to={item.path}>{item.title}</NavLink>
              }
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
});

// export default SubMenu;


const mapStateToProps = response => ({ response });

export default connect(mapStateToProps)(withRouter(SubMenu));
