import { API, ROUTES } from 'common/constants';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import React from 'react';

const SidebarWorkspace = props => {
  const { user, workspace } = props.user;
  if (user) {
    return (
      <div className="c-sidebar__workspace">
        <Link to={ROUTES.MANAGE_PROFILE}>
          <Image src={`${API.AVATAR}?name=${workspace.name}?s=40`} alt={workspace.name} />
        </Link>
      </div>
    );
  } else {
    return '';
  }
};

export default SidebarWorkspace;
