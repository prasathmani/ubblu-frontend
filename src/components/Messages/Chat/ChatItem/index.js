import './index.scss';

import { Alert, Button, Modal, Toast } from 'react-bootstrap';
import { ModalPortal, ToastPortal } from 'components/ReactPortal';
import React, { Component } from 'react';

import Avatar from 'components/Avatar';
import Moment from 'react-moment';
import get from 'lodash/get';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import SystemMessage from 'components/Messages/Chat/SystemMessage';
import FileCard from 'components/Messages/Chat/FileCard';
import { USERID, generateProfileUrl } from 'common/utils/helper';
import { setContenteditFocus } from 'common/utils';
import { getUserDetails } from 'store/api';

/**
 * Local usage varaibles
 */
let divStyle = {
    top: 0,
    left: 0,
  },
  evt = {
    currentTarget: {
      dataset: {
        action: null,
      },
    },
  };

const getTimeDifference = date => {
  const current = new Date();
  const msgCreatedDate = new Date(date);
  const seconds = (current.getTime() - msgCreatedDate.getTime()) / 1000;
  return seconds;
};

const MESSAGE_DELETING_TIME_LIMIT = 21600;

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionUserId: USERID(),
      actionMenu: false,
      edit: false,
      delete: false,
      download: false,
      toDo: false,
      pin: true,
      quote: true,
      isEditing: false,
      isDelete: false,
      isDownload: false,
      isShowError: false,
      isPinMsg: false,
      profile_image: null,
      showDeleteMessageInfo: false,
    };

    this.msgEditor = React.createRef();
    // this.fetchUserDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    //set focus to editor
    if (this.msgEditor.current) {
      setContenteditFocus(this.msgEditor.current);
    }
  }

  // fetchUserDetails = () => {
  //   getUserDetails(this.props.sendBy).then(data => {
  //     const userdata = get(data, 'data.user', {});
  //     const profile_image = generateProfileUrl(userdata.name ? userdata.name : userdata.username, userdata.profile_color);
  //     this.setState({ profile_image });
  //   }).catch(err => {
  //     console.info('ERROR', err);
  //   })
  // }

  /**
   *message action menu click events
   * @param {event}
   */
  handleMenuClick = evt => {
    const action = evt.currentTarget.dataset.action;
    switch (action) {
      case 'edit-message':
        this.editMessage(evt);
        break;
      case 'pin-message':
        this.pinMessage(evt);
        break;
      case 'quote-message':
        this.quoteMessage(evt);
        break;
      case 'delete-message':
        this.deleteMessage(evt);
        break;
        break;
      case 'download-file':
        this.downloadFile(evt);
        break;
      default:
        console.log(`Unrecognized action: ${action}`);
    }
  };

  /**
   * get the action menu position, adjust the position
   * @param {event}
   */
  getMenuPosition = e => {
    let left, top;
    top = window.scrollX + e.target.getBoundingClientRect().top;
    left = window.scrollX + e.target.getBoundingClientRect().left + 30;
    if (window.innerWidth < left + 140) {
      left = left - 140;
      top = top + 20;
    }
    divStyle = { left: left, top: top - 75 };
  };

  /**
   * show and hide action menu
   * @param {event}
   */
  handleActionMenu = e => {
    if (e.target.closest('.options-action')) {
      this.getMenuPosition(e);
      //TODO :: sessionUserId should be number
      // eslint-disable-next-line
      if (this.props.sendBy == this.state.sessionUserId) {
        this.setState(
          {
            actionMenu: true,
            edit: true,
            delete: true,
            download: true,
            quote: true,
            toDo: true,
          },
          () => document.addEventListener('click', this.closeMenu),
        );
      } else {
        this.setState(
          {
            actionMenu: true,
            download: true,
            edit: false,
            delete: false,
            toDo: true,
            quote: true,
          },
          () => document.addEventListener('click', this.closeMenu),
        );
      }
    }
  };

  /**
   * close the actin menu on window click
   * @param {event}
   */
  closeMenu = e => {
    if (e === 0 || !e.target.closest('.c-message-actions')) {
      this.setState(
        {
          actionMenu: false,
        },
        () => document.removeEventListener('click', this.closeMenu),
      );
    }
  };

  /**
   * show editor on click on edit message
   * @param {event}
   */
  editMessage = e => {
    //check already any other message is on edit
    // c-input__editor
    if (document.querySelector('.c-input__editor')) {
      this.setState({
        isEditing: false,
        actionMenu: false,
        isShowError: true,
      });
      return;
    }
    this.setState({
      isEditing: true,
      actionMenu: false,
    });
  };

  /**
   * update the state on save on edit message
   * @param {event}
   */
  saveEditMessage = e => {
    let _msgEditor = this.msgEditor.current;
    this.setState(
      {
        isEditing: false,
        actionMenu: false,
      },
      () => {
        evt.currentTarget.dataset.action = 'save-message';
        this.props.click(evt, _msgEditor, this.props);
      },
    );
  };

  /**
   * cancel the current edit message
   * @param {event}
   */
  cancelEditMessage = e => {
    this.setState({
      isEditing: false,
      actionMenu: false,
    });
  };

  /**
   * cancel the current delete message
   * @param {event}
   */
  cancelDeleteMessage = e => {
    this.setState({
      isEditing: false,
      isDelete: false,
      actionMenu: false,
    });
  };

  /**
   * hide the toast message
   * @param {event}
   */
  cancelToastMessage = e => {
    this.setState({
      isShowError: false,
    });
  };

  /**
   * delete the selected message
   * @param {event}
   */
  deleteMessage = e => {
    this.setState({
      isEditing: false,
      isDelete: true,
      actionMenu: false,
    });
  };

  downloadFile = e => {
    let _msgEditor = this.msgEditor.current;

    this.setState(
      {
        isEditing: false,
        isDelete: false,
        isDownload: true,
        actionMenu: false,
      },
      () => {
        evt.currentTarget.dataset.action = 'download-file';
        this.props.click(evt, _msgEditor, this.props);
      },
    );
  };

  /**
   * Save delete the selected message
   * @param {event}
   */
  saveDeleteMessage = e => {
    this.setState(
      {
        isEditing: false,
        isDelete: false,
        actionMenu: false,
      },
      () => {
        const { created_at } = this.props;
        const timeElapsed = getTimeDifference(created_at);
        if (timeElapsed > MESSAGE_DELETING_TIME_LIMIT) {
          this.setState({ showDeleteMessageInfo: true }, () => {
            setTimeout(() => {
              this.setState({ showDeleteMessageInfo: false });
            }, 2000);
          });
        } else {
          evt.currentTarget.dataset.action = 'delete-message';
          this.props.click(evt, null, this.props);
        }
      },
    );
  };

  saveMessageAsToDo = e => {
    this.setState(
      {
        isEditing: false,
        isDelete: false,
        actionMenu: false,
      },
      () => {
        evt.currentTarget.dataset.action = 'to-do-message';
        this.props.click(evt, e, this.props);
      },
    );
  };

  /**
   * pin the selected message into conversation
   * @param {event}
   */
  pinMessage = e => {
    this.setState({
      actionMenu: false,
      isPinMsg: true,
    });
  };

  /**
   * remove the pin from conversation and update the state
   * @param {event}
   */
  cancelPinMessage = e => {
    this.setState({
      isPinMsg: false,
    });
  };

  /**
   * save pin message and update the state
   * @param {event}
   */
  savePinMessage = e => {
    this.setState(
      {
        actionMenu: false,
        isPinMsg: false,
      },
      () => {
        evt.currentTarget.dataset.action = 'pin-message';
        this.props.click(evt, null, this.props);
      },
    );
  };

  quoteMessage = e => {
    let _msgEditor = this.msgEditor.current;

    this.setState(
      {
        isEditing: false,
        isDelete: false,
        isDownload: false,
        actionMenu: false,
        isQuote: true,
      },
      () => {
        console.log('msg id to be quoted', this.props.sendBy, this.props.id);
        // TODO::@Rohan, create separate component and render
        let $chatInput = document.querySelector('.quoted__message');
        let quoteHtml = `<div class="c-quote" >
                    <span class="c-quote-icon">
                      <i class="fas fa-quote-left"></i>
                    </span>
                    <span class="c-quote-msg" contenteditable="false">${this.props.message}</span><br />
                  </div>`;
        $chatInput.innerHTML = quoteHtml;
        $chatInput.setAttribute('quoted-msgId', this.props.id);
        $chatInput.setAttribute('quoted-msgSenderId', this.props.sendBy);
      },
    );
  };

  // messageTemplateFile = files => {
  //   return (
  //     <div className="row c-msg__body--images">
  //       {files.map((file, i) => (
  //         <a href={file} className="col" rel="noopener noreferrer" key={i}>
  //           <img src={file} alt="img-1" className="img-thumbnail" />
  //         </a>
  //       ))}
  //     </div>
  //   );
  // };

  messageTemplateFile = files => {
    return (
      <div className="row c-msg__body--images">
        {/*<a  className="col" rel="noopener noreferrer">*/}
        {/*  <img src={files.thumbnailLink} alt={files.name}  className="img-thumbnail" onclick="false" />*/}
        {/*</a>*/}
        {/*onClick={evt => this.handleMenuClick(evt)}*/}
        <FileCard files={files} onDownload={this.handleMenuClick} />
      </div>
    );
  };

  messageTemplateYoutube = url => {
    return (
      <iframe
        width="400"
        height="225"
        src={url + '?feature=oembed&amp;autoplay=0&amp;iv_load_policy=3'}
        frameBorder="0"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
        title="youtube"
      />
    );
  };

  messageRender = (type, message = '', fileDetails) => {
    switch (type) {
      case 'TEXT':
        let formatted;
        formatted = message
          .split(' ')
          .map(v => (v.includes('@') ? `<span class='tagged_user' id="tagged" >${v}</span>` : v))
          .join(' ');
        formatted = formatted
          .split(' ')
          .map(v => (v.includes('#') ? `<span class='tagged_user' >${v}</span>` : v))
          .join(' ');

        return formatted;
      case 'FILE':
        return this.messageTemplateFile(fileDetails);
      case 4:
        return this.messageTemplateYoutube(message);
      default:
        return null;
    }
  };

  render() {
    const {
      id,
      type,
      is_tagged,
      cssClass,
      avatarShow,
      avatar,
      quoted_msg_id,
      username,
      alt,
      showUsername,
      name,
      position,
      edited,
      pinned,
      pinnedBy,
      sentAt,
      message,
      fileDetails,
      messages,
      unread,
      deleted,
      quoted,
      quoted_msg,
      quoted_msg_sender_name,
      quoted_msg_timestamp,
      isAdmin,
      isAChannel,
      profile_color
    } = this.props;
    const shouldDisplayTodo = isAChannel ? (isAdmin ? true : false) : true;
    let now = moment(new Date()); //todays date
    let end = moment(sentAt); // msg sent date
    let duration = moment.duration(now.diff(end));
    let hoursPassed = duration.asHours();
    let istagged = false;
    if (message && message.search('@') !== -1) {
      istagged = true;
    }

    if (deleted) return null
    let src = avatar;
    if(!src && profile_color){
      const [background] = profile_color.split(' ') || [];
      src = `https://ui-avatars.com/api/?name=${name}&s=32&background=${background}`;
    }
    return (
      <React.Fragment>
        {(() => {
          switch (type) {
            case 'system':
              return (
                <SystemMessage
                  className="date-spliter"
                  text={
                    moment(sentAt).format('ddd') +
                    ',' +
                    '  ' +
                    moment(sentAt).format('MMMM') +
                    '  ' +
                    moment(sentAt).format('Do')
                  }
                />
              );
            //0:
            case 'TEXT':
            case 'FILE':
            case 4:
            case 'CHAT_RECEIVE_MESSAGE':
              return (
                <div className={`c-msg  c-msg-${position}`}>
                  <div className="c-msg__item" data-id={id} id={id}>
                    <div className="c-msg__item--avatar">
                      {avatarShow && <Avatar userid={this.props.sendBy} src={src} alt={name} className="rounded" />}
                    </div>
                    <div
                      className="c-msg__body"
                      style={{ border: quoted_msg_id ? '1px solid #317fe4' : istagged ? '1px solid #317fe4' : '' }}
                    >
                      {quoted_msg_id && (
                        <div
                          className="c-msg__body--quote"
                          onClick={() => {
                            const quote_el = document.querySelector(`[data-id="${quoted_msg_id}"]`);
                            quote_el.scrollIntoView({ behavior: 'smooth' });
                            setTimeout(() => {
                              quote_el.style.opacity = 0.5;
                              setTimeout(() => (quote_el.style.opacity = 1), 500);
                            }, 1000);
                          }}
                        >
                          <p className="c-msg__body--quote--icon">
                            <i class="fas fa-quote-left"></i>
                          </p>
                          <p className="c-msg__body--quote--quoted-message">
                            {quoted_msg}
                            <p className="c-msg__body--quote--quoter-message">
                              {quoted_msg_sender_name}, {quoted_msg_timestamp}
                            </p>
                          </p>
                          <hr />
                        </div>
                      )}
                      <div className="c-msg__body--top">
                        <div className="c-msg__body--top-username">{showUsername && name}</div>
                        <div className="c-msg__body--top-options">
                          {edited && <i className="options-edited"> (edited) </i>}
                          {pinned && (
                            <span className="options-pinned">
                              <i className="fas fa-thumbtack" />
                              Pinned By <a href={'#/' + pinnedBy}>@{pinnedBy}</a>
                            </span>
                          )}
                          {/* {this.props.date && !isNaN(this.props.date) && (this.props.dateString || this.props.date)} */}
                          <span className="options-date">
                            <Moment format="HH:mm A">{new Date(sentAt)}</Moment>
                          </span>
                          <span className="options-action" onClick={this.handleActionMenu}>
                            <i className="fas fa-ellipsis-h" />
                            {this.state.actionMenu && (
                              <ModalPortal>
                                <div className="ReactModal__Overlay">
                                  <div className="c-message-actions" id="c-message-actions" style={divStyle}>
                                    <ul>
                                      {this.state.edit && (
                                        <li data-action="edit-message" onClick={evt => this.handleMenuClick(evt)}>
                                          Edit Message
                                        </li>
                                      )}
                                      {this.state.pin && (
                                        <li data-action="pin-message" onClick={evt => this.handleMenuClick(evt)}>
                                          Pin Message
                                        </li>
                                      )}
                                      {this.state.quote && (
                                        <li data-action="quote-message" onClick={evt => this.handleMenuClick(evt)}>
                                          Quote Message
                                        </li>
                                      )}
                                      {this.state.delete && (
                                        <li data-action="delete-message" onClick={evt => this.handleMenuClick(evt)}>
                                          Delete Message
                                        </li>
                                      )}
                                      {this.state.toDo && shouldDisplayTodo && (
                                        <li data-action="to-do-message" onClick={evt => this.saveMessageAsToDo(evt)}>
                                          Make this Message as To-Do
                                        </li>
                                      )}
                                      {this.state.download && type == 'FILE' && (
                                        <li data-action="download-file" onClick={evt => this.handleMenuClick(evt)}>
                                          Download File
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </ModalPortal>
                            )}
                          </span>
                          {this.state.isDelete && (
                            <Modal show={true} onHide={this.cancelDeleteMessage} centered>
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Message</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete this message? This cannot be undone.
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="outline-secondary" onClick={this.cancelDeleteMessage}>
                                  Cancel
                                </Button>
                                <Button variant="primary" onClick={this.saveDeleteMessage}>
                                  Delete
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          )}
                          {this.state.isPinMsg && (
                            <Modal show={true} onHide={this.cancelPinMessage} centered>
                              <Modal.Header closeButton>
                                <Modal.Title>Pin Message</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>Are you sure you want to pin this message to this conversation?</Modal.Body>
                              <Modal.Footer>
                                <Button variant="outline-secondary" onClick={this.cancelPinMessage}>
                                  Cancel
                                </Button>
                                <Button variant="primary" onClick={this.savePinMessage}>
                                  Yes, Pin this message
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          )}
                        </div>
                      </div>

                      <div className="c-msg__body--bottom">
                        {!this.state.isEditing ? (
                          type === 'FILE' || type === 4 ? (
                            <div className="c-msg__body--bottom-msg">
                              {this.messageRender(type, message, fileDetails)}
                            </div>
                          ) : (
                            <div
                              className="c-msg__body--bottom-msg"
                              style={{ textDecoration: deleted ? 'line-through' : 'inline' }}
                              dangerouslySetInnerHTML={{ __html: this.messageRender('TEXT', message) }}
                            />
                          )
                        ) : (
                          <Scrollbars autoHeight autoHeightMin={39} autoHeightMax={140} hideTracksWhenNotNeeded={true}>
                            <div
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              autoFocus
                              dir="auto"
                              role="textbox"
                              tabIndex="1"
                              aria-label="Enter Message"
                              aria-multiline="true"
                              autoComplete="off"
                              spellCheck={true}
                              className="c-input__editor"
                              placeholder={this.placeholder}
                              onChange={this.onChange}
                              onPaste={this.onPaste}
                              ref={this.msgEditor}
                              data-action="save-message"
                              onKeyPress={e => {
                                if (e.shiftKey && e.charCode === 13) {
                                  return true;
                                }
                                if (e.charCode === 13) {
                                  this.saveEditMessage();
                                  e.preventDefault();
                                  return false;
                                }
                              }}
                            >
                              {message}
                            </div>
                            <div className="c-input__editor--actions">
                              <Button
                                variant="outline-primary"
                                className="msg-editor-cancel"
                                onClick={this.cancelEditMessage}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                className="msg-editor-save"
                                data-action="save-message"
                                onClick={this.saveEditMessage}
                              >
                                Save
                              </Button>
                            </div>
                          </Scrollbars>
                        )}
                        {unread > 0 && (
                          <div className="c-msg__body--bottom-status">
                            <span>{unread}</span>
                          </div>
                        )}
                      </div>
                      {this.state.isShowError && (
                        <ToastPortal>
                          <Toast show={true} onClose={this.cancelToastMessage} animation={true}>
                            <Toast.Header>
                              <strong className="mr-auto">Error</strong>
                            </Toast.Header>
                            <Toast.Body className="text-danger">
                              Finish editing message first! Or press cancel if you’ve changed your mind.
                            </Toast.Body>
                          </Toast>
                        </ToastPortal>
                      )}
                    </div>
                  </div>
                  {this.state.showDeleteMessageInfo && (
                    <Alert className="c-msg__delete-alert" variant="warning">
                      You can't delete this message.
                    </Alert>
                  )}
                </div>
              );
            case 'error':
              return <div>{this.props.text}</div>;
            default:
              return null;
          }
        })()}
      </React.Fragment>
    );
  }
}

ChatItem.propTypes = {
  id: PropTypes.number,
  type: PropTypes.any,
  cssClass: PropTypes.string,
  avatarShow: PropTypes.bool,
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  alt: PropTypes.string,
  showUsername: PropTypes.bool,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  edited: PropTypes.bool,
  pinned: PropTypes.bool,
  pinnedBy: PropTypes.string,
  sentAt: PropTypes.string,
  message: PropTypes.any.isRequired,
  unread: PropTypes.number,
};

ChatItem.defaultProps = {
  id: null,
  type: 0,
  cssClass: undefined,
  avatarShow: false,
  username: null,
  avatar: 'https://ca.slack-edge.com/TJF18K66N-UJU8QEXJT-gc5fd7e15adb-48',
  alt: 'Avatar',
  showUsername: false,
  name: null,
  position: 'left',
  edited: false,
  pinned: false,
  pinnedBy: null,
  sentAt: new Date().getTime(),
  message: null,
  unread: 0,
};

export default ChatItem;
