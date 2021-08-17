import './index.scss';

import { NavLink } from 'react-router-dom';
import { ROUTES } from 'common/constants';
import React from 'react';
import SidebarWorkspace from './Workspace';
import Userheader from './Userheader';

//main menu items
const menuItems = [
  {
    id: 0,
    title: 'Messages',
    selected: false,
    path: ROUTES.MESSAGES,
    icon: 'far fa-envelope',
  },
  {
    id: 2,
    title: 'manage',
    selected: false,
    path: ROUTES.MANAGE_PROFILE,
    icon: 'far fa-user',
  },
];

//toggle sidebar
const handleSidebarToggle = e => {
  document.querySelector('.main-layout').classList.toggle('sidebar-collapse');
};

const Sidebar = React.memo(props => {
  return (
    <React.Fragment>
      <div className="c-sidebar">
        <div className="text-center d-none">
          <img src="/assets/images/ubblu-logo.png" alt="UBBLU" />
        </div>
        <Userheader user={props.user} handleAvailability={props.handleAvailability} />
        <div className="c-sidebar__menu app-none">
          <ul className="c-sidebar__menu_list">
            {menuItems.map(item => (
              <li key={item.id}>
                <NavLink to={item.path}>
                  <span>
                    <i className={item.icon} />
                  </span>
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <SidebarWorkspace user={props.user} />
        </div>
      </div>
    </React.Fragment>
  );
});

export default Sidebar;
