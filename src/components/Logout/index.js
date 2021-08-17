import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutAction } from 'store/actions';

class Logout extends Component {
  state = {
    isLoggedIn: false,
  };

  constructor(props) {
    super(props);
    document.title = 'Ubblu | Login';
  }

  componentDidMount() {
    this.props.logoutAction({
      redirectToLogin: true,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="auth__layout__header">
          You're logged out successfully.
          <a href="/login" role="button">
            Click here
          </a>{' '}
          to go to login page.
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      logoutAction,
      // add other watcher sagas to this object to map them to props
    },
    dispatch,
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(Logout);
