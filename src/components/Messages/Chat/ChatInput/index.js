import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import get from 'lodash/get';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { googleSignIn, uploadFiles, getAllUsersByChannel, getDepartments, getWorkspaceUsersRelationToAChannel, fetchChannelInformation } from 'store/api';
import { MentionsInput, Mention } from 'react-mention'
import './index.scss';
import './mentions.scss';


import FileUpload from 'components/Messages/Chat/FileUpload';
import { API } from 'common/constants';
import { getCookie } from 'common/utils';


export class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue,
      showEmojis: false,
      previewFileUpload: false,
      previewFilesList: [],
      userList: [],
      departmentList: [],
      mentionData: {},
      showDepartments: false,
      fetchingUserList: false,
      shouldDisableInputField: false,
      tagged_id: []
    };
    this.ALLOWEDFILECOUNT = 10;
    this.fileCount = 0;
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.fetchDepartments();
  }


  resetInput = () => {
    this.setState({ value: this.props.defaultValue, mentionData: {} });
  }

  fetchDepartments = async () => {
    const { data } = await getDepartments(getCookie('wid'));
    let departmentList = data ? data.departments.map(d => ({ id: d.name, display: d.name })) : [];
    this.setState({ departmentList })
  }

  onChange(e) {
    if (this.props.maxlength && (e.target.value || '').length > this.props.maxlength) {
      if (this.props.onMaxLengthExceed instanceof Function) this.props.onMaxLengthExceed();
      return;
    }

    this.setState({
      value: e.target.value,
    });
    if (this.props.onChange instanceof Function) this.props.onChange(e);

    if (this.props.multiline === true) {
      if (this.props.autoHeight === true) {
        e.target.style.height = this.props.minHeight + 'px';

        if (e.target.scrollHeight <= this.props.maxHeight) e.target.style.height = e.target.scrollHeight + 'px';
        else e.target.style.height = this.props.maxHeight + 'px';
      }
    }
  }

  clear() {
    var event = {
      FAKE_EVENT: true,
      target: this.input,
    };
    this.input.value = '';
    this.onChange(event);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.state.fetchingUserList) {
      this.fetchChannelUsers();
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentDidMount() {
    this.props.onRef(this);
    if (this.props.autofocus === true) this.input.focus();
  }

  /**
   * show emoji popup
   * @param {event}
   */
  showEmojis = e => {
    this.setState(
      {
        showEmojis: true,
      },
      () => document.addEventListener('click', this.closeMenu),
    );
  };

  /**
   * close the emoji selector popup
   * @param {event}
   */
  closeMenu = e => {
    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
      this.setState(
        {
          showEmojis: false,
        },
        () => document.removeEventListener('click', this.closeMenu),
      );
    }
  };

  /**
   * Remove formatting from a contentEditable div on paste
   * https://stackoverflow.com/q/6899659/1164642
   * @param {event}
   */
  onPaste = e => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('inserttext', false, text);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.channelId !== prevProps.channelId) {
      this.fetchChannelUsers();
      this.fetchChannelData();
    }
    if (this.props.roomId !== prevProps.roomId) {
      this.resetInput();
      document.querySelector(".quoted__message").setAttribute("quoted-msgid", null)
      document.querySelector(".quoted__message").innerHTML = null;
      this.setState({ shouldDisableInputField: false })
    }
  }

  /**
   * Handle files upload events
   */

  handleFileUpload = async (evt, opts) => {
    let action = evt.currentTarget.dataset.action;
    console.log('action', action);
    console.log('uploaded files data', this.state.previewFilesList);

    if (action == 'fileupload-save') {

      const formData = new FormData();
      // // const imgname = document.querySelector('input[type=file]').value;
      formData.append('file', this.state.previewFilesList[0]);
      formData.append('fileDescription', opts);
      // return    window.location = (`${API.DEV_BASE_BACKEND_URL}/api/v1/dropbox/signIn`);
      const userid = getCookie('uid');

      uploadFiles(formData)
        .then(res => {
          if (res.data.success) {
            console.log('redirection true for auth', res.data, res.status);
            if (opts == null) {
              opts = 'No file description'
            }
            this.props.onFileUpload(res.data, opts);
            this.uploadFilesPreviewClose('fileupload-cancel');

          } else {
            console.log('redirection false for auth', res.data, res);


            if (res.data.errors[0]["status"] == 3) {
              return window.location = (`${API.BASE_BACKEND_URL}/api/v1/google/signIn?id=${userid}`);


            }

            if (res.data.errors[0]["status"] == 2) {
              return window.location = (`${API.BASE_BACKEND_URL}/api/v1/dropbox/signIn?id=${userid}`);

            }
            console.log('redirection false for auth', res.data, res);
            this.setState({ profileImageError: res.data.errors[0]["message"] });
            // window.location = (`${API.DEV_DEV_BASE_BACKEND_URL}/api/v1/dropbox/signIn`);
            // window.location = (`http://localhost:8080/api/v1/google/signIn`);

            // this.props.onFileUpload(res.data, opts);
            this.uploadFilesPreviewClose('fileupload-cancel');

          }
        })
        .catch(error => {
          // this.setState({ profileImageError: res.data.errors[0]["message"] });
        });

      //  window.location =(`http://localhost:8080/api/v1/dropbox/signIn`);
    }


    switch (action) {
      case 'fileupload-save':
        this.uploadFilesSave();
        break;
      case 'fileupload-cancel':
        this.uploadFilesPreviewClose(evt);
        break;
      case 'fileupload-add':
        this.handleFileSelect(evt);
        break;
      case 'fileupload-remove':
        this.uploadFilesRemove(evt);
        break;
      default:
        console.log(`Unrecognized action: ${action}`);
    }
  };

  /**
   * Close the files preview modal
   * Reset the files state
   * @param {event}
   */
  uploadFilesPreviewClose = e => {
    this.fileCount = 0;
    this.setState({
      previewFileUpload: false,
      previewFilesList: [],
    });
  };

  /**
   * Remove selected files from file preview
   * @param {event}
   */
  uploadFilesRemove = e => {
    const _fileName = e.currentTarget.dataset.name;
    this.fileCount = this.fileCount - 1;
    this.setState({
      previewFilesList: this.state.previewFilesList.filter(function (file) {
        return file.name !== _fileName;
      }),
    });
  };

  uploadFilesSave = e => { };

  /**
   * Add a new file in files preview modal
   * @param {Array} list of added files
   */
  uploadFilesAdd = files => {
    this.setState(({ previewFilesList }) => ({
      previewFileUpload: true,
      previewFilesList: [...previewFilesList, ...files],
    }));
    console.log('uploaded files data', this.state.previewFilesList);

  };

  /**
   * Handle on clicking the attachment icon
   * @param {event}
   */
  handleFileSelect = e => {
    console.log('file selected')
    const self = this,
      fileSelector = document.createElement('input'),
      inValidFileExtensions = ['exe', 'py', 'html', 'php'];
    let selectedFiles = [];
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    fileSelector.addEventListener('change', function (e) {
      const filesList = Array.from(this.files);

      filesList.forEach(file => {
        let _ext = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);
        if (!inValidFileExtensions.includes(_ext) && self.fileCount < self.ALLOWEDFILECOUNT) {
          selectedFiles.push(file);
          self.fileCount++;
        } else {
          console.log('Invalid File type');
        }
      });

      self.uploadFilesAdd(selectedFiles);
    });
    fileSelector.click();
    console.log('uploaded files data', this.state.previewFilesList)
  };

  fetchChannelData = async () => {
    let channeldata = await fetchChannelInformation(this.props.channelId);
    const userid = getCookie('uid');
    if (Number(userid) === get(channeldata, "data.user.created_by", null)) {
      this.setState({ showDepartments: true });
    }
  }

  fetchChannelUsers = () => {
    if (this.props.channelId) {
      ///console.log("this.props.channelId",this.props.channelId);
      this.setState({ fetchingUserList: true }, () => {
        getAllUsersByChannel({ channelId: this.props.channelId }, true).then(data => {
          const loggedInUserId = getCookie('uid');
          const userlist = get(data, "data.users", []);
          if (userlist.length) {
            const formattedUserList = userlist.map(user => ({
              uid: user.id,
              id: user.username,
              display: user.name ? user.name : user.username
            }));
            const shouldDisableInputField = !formattedUserList.some(user => user.uid == loggedInUserId);
            this.setState({ userList: formattedUserList, shouldDisableInputField });
            this.props.isNotMember(shouldDisableInputField);
          }
        }).catch(err => {
          console.info('ERRORDATA', err);
        });
      });
    } else {
      this.setState({ userList: [] })
    }
  }

  renderUserSuggestion = (entry, search) => {
    if (!this.state.userListVisible) {
      this.setState({ userListVisible: true });
    }
  }

  displayTransform = (id, display, type) => {

    var { userList } = this.state;
    var tagged_id = this.state.tagged_id;
    console.log("tagged_id start", tagged_id);
    if (userList.length > 0) {

      userList.forEach(function (item, index) {
        //console.log("userList",tagged_id);

        if (item.id === id && tagged_id.find(element => element === item.uid) === undefined) {
          //console.log("tagged_id.find(item.uid)",tagged_id.find(element => element === item.uid)); 
          //tagged_id.find(item.uid);
          tagged_id.push(item.uid);
          console.log("userList user.name", tagged_id);
        }
        // this.setState({tagged_id:user.name===id?user.id:null})            
      });
    }

    console.info('ID DISPLAY TYPE', id, display, type, tagged_id);
    this.setState({ tagged_id: tagged_id })
    let temp = `@${id}`;
    if (type === 'user') temp = `@${id}`;
    if (type === 'channel') temp = `#${display}`
    console.log("temp", temp);
    return temp;
  }

  handleChange = (event, newValue, newPlainTextValue, mentions) => {
    console.log("userList", event, this.state.userList);
    console.log("newValue", newValue);
    console.log("newPlainTextValue", newPlainTextValue);
    console.log("mentions", mentions, mentions.length);
    // if(mentions){
    //   mentions=true;
    // }
    if (mentions.length !== 0) {
      mentions = true;
    }
    else {
      mentions = false;
    }
    this.setState({
      value: newPlainTextValue,
      mentionData: { newValue, newPlainTextValue, mentions }
    })
  }

  addEmoji = ({ native }) => {
    const value = this.state.value + native;
    this.setState({ value });
  }

  /**
   * Remove quoted message from mention-input when
   * backspace event is fired and input field is empty.
   * @param {event}
   */
  onKeyDown = (event) => {
    const key = event.keyCode || event.charCode;
    const { value = "" } = this.state;
    if (key == 8 && !value.length) {
      document.querySelector(".quoted__message").setAttribute("quoted-msgid", null)
      document.querySelector(".quoted__message").innerHTML = null;
    }
  }

  render() {
    const { shouldDisableInputField } = this.state;
    return (

      <div className={`c-input ${this.props.className}`}>
        {this.state.showEmojis && (
          <span ref={el => (this.emojiPicker = el)}>
            <Picker
              title="Pick your emoji…"
              native={true}
              onSelect={this.addEmoji}
              style={{ position: 'absolute', bottom: '60px', left: '1px' }}
            />
          </span>
        )}
        <div className="c-input-container">
          <div className="c-input__buttons">
            <button type="button" aria-label="Add Emoji" disabled={shouldDisableInputField} onClick={this.showEmojis}>
              <i className="far fa-smile" />
            </button>
          </div>
          <div className="quoted__message" />
          <MentionsInput
            inputRef={ref => {
              if (this.props.inputRef instanceof Function) this.props.inputRef(ref);
              this.input = ref;
            }}
            placeholder={this.props.placeholder}
            markup="@{{__type__||__id__||__display__}}"
            // markup='@[__display__](__id__)'
            displayTransform={this.displayTransform}
            value={this.state.value}
            onChange={this.handleChange}
            onKeyPress={this.props.onKeyPress}
            onKeyDown={this.onKeyDown}
            className="mentions"
            disabled={shouldDisableInputField}
          >
            <Mention
              type="user"
              trigger="@"
              data={this.state.userList}
              className="mentions__mention"
            />
            {this.state.showDepartments && (
              <Mention
                type="department"
                trigger="#"
                data={this.state.departmentList}
                className="mentions__mention"
              />
            )}
          </MentionsInput>
          {this.props.rightButtons && (
            <div className="c-input__buttons">
              <button
                disabled={shouldDisableInputField}
                type="button"
                aria-label="Add files"
                className="c-input__buttons-upload"
                onClick={this.handleFileSelect}
              >
                <i className="fas fa-paperclip" />
              </button>
              {this.props.rightButtons}
            </div>
          )}

          {this.state.previewFileUpload && (
            <FileUpload filesList={this.state.previewFilesList} events={this.handleFileUpload} />
          )}
        </div>
      </div>

    );
  }
}

ChatInput.propTypes = {
  rightButtons: PropTypes.object,
  type: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  addEmojis: PropTypes.func.isRequired,
};

ChatInput.defaultProps = {
  type: 'text',
  placeholder: '',
  defaultValue: '',
  onChange: null,
  rightButtons: false,
  leftButtons: false,
  multiline: false,
  minHeight: 25,
  maxHeight: 200,
  autoHeight: true,
  inputStyle: null,
  inputRef: null,
  maxlength: null,
  onMaxLengthExceed: null,
  autofocus: false,
};

export default ChatInput;
