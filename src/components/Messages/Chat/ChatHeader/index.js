import React, { Component } from 'react';

import PropTypes from 'prop-types';
// import moment from 'moment';
import moment from 'moment-timezone';
import Avatar from 'components/Avatar';
import { getUserDetails, fetchChannelInformation } from 'store/api';
import get from 'lodash/get';

import { Col, Row, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { generateProfileUrl, generateChannelUrl } from 'common/utils/helper';
class ChatHeadInfo extends Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      update: null,
      profileUrl: null,
      current_profile: null,
      channel_data: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      update: nextProps,
    });
    if (nextProps.channelId) {
      this.fetchChannelDetailS(nextProps.channelId);
    }
    if (!this.state.profileUrl || this.state.current_profile !== nextProps.id) {
      this.setState({
        profileUrl: generateProfileUrl(nextProps.name ? nextProps.name : nextProps.username, nextProps.profile_color),
        current_profile: nextProps.id,
      });
    }
  }

  fetchChannelDetailS = channelId => {
    fetchChannelInformation(channelId, true).then(data => {
      const channel_data = get(data, 'data.user', {});
      this.setState({ channel_data });
    });
  };

  fetchUserDetails = () => {
    getUserDetails(this.props.id)
      .then(data => {
        const userdata = get(data, 'data.user', {});
        const profileUrl = generateProfileUrl(
          userdata.name ? userdata.name : userdata.username,
          userdata.profile_color,
        );
        this.setState({ profileUrl });
      })
      .catch(err => {
        console.info('ERROR', err);
      });
  };

  render() {
    let { props, state } = this;
    let { channel_data } = this.state;
    let channelMember;
    if (props.channelId && (state.channel_data.status == 'MEMBER' || state.channel_data.status == 'ADMIN')) {
      channelMember = true;
    }
    if (props.channelId && state.channel_data.status == null) {
      channelMember = false;
    }
    const { user_workspace_relationships = [] } = this.props;
    const [userWorkspaceRelationship = {}] = user_workspace_relationships;
    return (
      //  = props => (
      <Col>
        <Row>
          <Col className="chat-header">
            <Media>
              {props.channelId ? (
                <p className="channel__avatar" style={generateChannelUrl(state.channel_data.colors)}>
                  {state.channel_data.channel_type === 'PUBLIC' && '#'}
                  {state.channel_data.channel_type === 'PRIVATE' && '🔒'}
                  {state.channel_data.channel_type === 'RESTRICTED' && '🔒'}
                </p>
              ) : (
                <Avatar
                  userid={props.id}
                  src={this.state.profileUrl}
                  alt={props.username}
                  url="details"
                  onClick={props.onClick}
                  presenceShow={props.availability ? true : false}
                  presenceStatus={props.availability}
                  variant="small"
                  className="rounded"
                />
              )}
              <Media.Body>
                <div className="chat-header__row">
                  {props.channelId ? (
                    <div>
                      <p>{state.channel_data.name}</p>
                      {channelMember ? null : <p>{state.channel_data.description}</p>}
                    </div>
                  ) : (
                    <div>
                      <p>{props.name || props.username}</p>
                    </div>
                  )}

                  <div>
                    {props && props.channelId && channel_data.users_count && (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="leave_channel">No of users in channel</Tooltip>}
                      >
                        <span>{channel_data.users_count + ' users  | '}</span>
                      </OverlayTrigger>
                    )}

                    <span>
                      <button
                        disabled={props.channelId && !channelMember ? true : false}
                        className="btn btn-link"
                        type="button"
                        onClick={props.onClicked}
                      >
                        View Profile
                      </button>
                    </span>
                  </div>
                </div>
              </Media.Body>
            </Media>
          </Col>
        </Row>
      </Col>
    );
  }
}

ChatHeadInfo.propTypes = {
  _id: PropTypes.string,
  profileImage: PropTypes.string,
  name: PropTypes.string,
  userName: PropTypes.string,
  onClick: PropTypes.func,
  availability: PropTypes.bool,
  timeZone: PropTypes.string,
};

ChatHeadInfo.defaultProps = {
  _id: null,
  profileImage: null,
  name: null,
  userName: null,
  onClick: null,
  availability: false,
  timeZone: null,
};

export default ChatHeadInfo;
