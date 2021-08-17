import './index.scss';

import { Button, Col, Container, Form, Image, Modal, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import { getUserDataAction, updateUserProfileAction } from 'store/actions';
import { getCookie,setCookie,deleteCookie,deleteAllCookies} from 'common/utils';
import { Timezone } from './data';
import { USERID, WORKSPACEID } from 'common/utils/helper';
import { generateProfileUrl } from 'common/utils/helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { uploadImages, getMyDetails } from 'store/api';

class ManageProfile extends Component {
  constructor(props) {
    super(props);
    this.isInitialRender = false;
    this.firstLoad = true;

    this.state = {
      showModel: false,
      validated: false,
      file: null,
      profile_image: '/assets/images/icons/user-icon.png',
      profileImageError: '',
      name: '',
      username: '',
      email: '',
      department: '',
      cloud_storage:'GOOGLE-DRIVE',
      workspaceName: '',
      availability: 'on',    
      timeZone: 'Asia/Kolkata',
      note: '',
      user: [],
      userId: USERID(),
      workspaceId: WORKSPACEID(),
      selectedOption: 'GOOGLE-DRIVE',
      errors: false,
      is_cookie:true,
      usernameValidations: false,
      nameValidations: false,
      at:getCookie('at'),
      uid:getCookie('uid'),
      wid: getCookie('wid')
    };

     // setCookie('at', getCookie('at'), 1);
      // setCookie('uid', getCookie('uid'), 1);
      // setCookie('wid', getCookie('wid'), 1);
    // this.fetchUserDetails();
  }

  componentDidMount() {
    if (!this.state.username) {
      this.props.getUserDataAction({ uid: this.state.userId, workspaceId: this.state.workspaceId });
    }
  }

  componentDidUpdate(prevProps, nextProps) {
    if (!this.state.profile_image && this.state.profile_color) {
      const { name, username, profile_color } = this.state
      this.setState({ profile_image: generateProfileUrl(name ? name : username, profile_color) })
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (get(nextProps, 'store.user', false)) {
      const userData = get(nextProps, 'store.user.response.user');
      if (userData && this.state.name !== userData.name && !this.isInitialRender) {
        this.isInitialRender = true;
        console.log('user data', userData)
        this.setState(userData);
      }
    }

    // if (
    //   this.isInitialRender === false &&
    //   nextProps &&
    //   nextProps.user &&
    //   nextProps.user.response &&
    //   nextProps.user.response.message === 'Success'
    // ) {
    //   const userData = nextProps.user.response.data;
    //   this.updateState(userData);
    //   this.isInitialRender = true;
    //   return false;
    // }
    return true;
  }

  updateState = _userData => {
    this.setState({
      profileImage: _userData.profileImage || '/assets/images/icons/user-icon.png',
      name: _userData.name || '',
      username: _userData.userName,
      department: get(_userData, 'user_workspace_relationships[0].Department.name', ''),
      workspaceName: get(_userData, 'user_workspace_relationships[0].workspace.name', ''),
      timeZone: _userData.timeZone,
      email: _userData.email,
      note: _userData.note || '',
      user: _userData,
      is_cookie:_userData.is_cookie
    });
  };
  handleOptionChange = changeEvent => {
    this.setState({
      cloud_storage: changeEvent.target.value,
    });
  };
  
  handleCookiesChange = async () => {

    if(!this.state.is_cookie)
    {              
      // localStorage.clear();
      // setCookie('is_cookie',true, 1); 
      // setCookie('at', this.state.at, 1);
      // setCookie('uid', this.state.uid, 1);
      // setCookie('wid',this.state.wid, 1);
      this.setState({
        is_cookie: true,
      });  
      
    }
    else{
      // deleteAllCookies();   
      // localStorage.setItem('is_cookie',false, 1); 
      // setCookie('at', this.state.at, 1);
      // setCookie('uid', this.state.uid, 1);
      // setCookie('wid',this.state.wid, 1);
      this.setState({
        is_cookie: false,
      });
     

    }
  };

  handleClose = () => {
    this.setState({ showModel: false });
  };

  handleShow = () => {
    this.setState({ showModel: true });
  };

  handleChange = event => {
    console.log('test', { [event.target.name]: event.target.value })
    if (event.target.name == 'username') {
      var letters = /^[0-9a-zA-Z_]+$/;
      if (event.target.value.match(letters) && event.target.value.length <= 7) {
        this.setState({
          usernameValidations: false
        })
      } else {
        this.setState({
          usernameValidations: true
        })
      }
      this.setState({ [event.target.name]: event.target.value });
    }
    if (event.target.name == 'name') {
      if (event.target.value.length < 8) {
        this.setState({
          nameValidations: true,
          [event.target.name]: event.target.value
        })
      } else if(event.target.value.length > 60){
        this.setState({
          nameValidations: true
        })
      } else {
        this.setState({
          nameValidations: false,
          [event.target.name]: event.target.value
        })
      }
    }
  };

  handleFileUpload = event => {
    const inputElm = event.target;
    if (event.target) {
      const fileName = inputElm.value.split('\\').pop();
      const fileLabel = inputElm.parentNode.querySelector('.custom-file-label');

      fileLabel.classList.add('selected');
      fileLabel.innerHTML = fileName;
    }

    this.setState({ file: event.target.files });
  };

  handleUploadAvatar = event => {
    const formData = new FormData();
    const imgname = document.querySelector('input[type=file]').value;
    formData.append('file', this.state.file[0]);
    const ext = imgname.substr(imgname.lastIndexOf('.') + 1);
    if (
      ext === 'jpg' ||
      ext === 'jpeg' ||
      ext === 'png' ||
      ext === 'gif' ||
      ext === 'PNG' ||
      ext === 'JPG' ||
      ext === 'JPEG'
    ) {
      uploadImages(formData)
        .then(response => {
          console.log('fil upload', response)
          if (response.success && response.data.status === 1) {
            this.setState({
              showModel: false,
            });
            this.props.getUserDataAction({ uid: this.state.userId, workspaceId: this.state.workspaceId });
            this.setState({ profile_image: response.data.imageUrl });

          } else {
            this.setState({ profileImageError: response.message });
          }
        })
        .catch(error => {
          this.setState({ profileImageError: error.message });
        });
    } else {
      this.setState({ profileImageError: 'Unsupported file format' });
    }
  };



  formToJSONString() {
    var obj = {};
    var elements = document.querySelector('form').querySelectorAll('input, select, textarea');
    console.log('form data', elements);
    for (var i = 0; i < elements.length; ++i) {
      var element = elements[i];
      var name = element.name;
      var value = element.value;

      // if (name !== 'email' && name !== 'availability') {
      obj[name] = value;
      // }

      if (name == 'fileUpload') {
        obj['cloud_storage'] = this.state.cloud_storage;
      }
    }

    return JSON.stringify(obj);
  }

  handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    const form_values = this.formToJSONString();
    console.log('form_values',form_values);

    if (!this.state.errors) {
      this.props.updateUserProfileAction(form_values);

      this.setState(
        {
          validated: true,
        },
        () => {
          if(this.state.is_cookie)
          {              
            localStorage.clear();
            setCookie('is_cookie',this.state.is_cookie, 1); 
            setCookie('at', this.state.at, 1);
            setCookie('uid', this.state.uid, 1);
            setCookie('wid',this.state.wid, 1);
           
            
          }
          else{
            deleteAllCookies();   
            localStorage.setItem('is_cookie',this.state.is_cookie, 1); 
            setCookie('at', this.state.at, 1);
            setCookie('uid', this.state.uid, 1);
            setCookie('wid',this.state.wid, 1);
          
          }
          toast.success('SUCCESS: User has been updated successfuly!')}
      );
    }
  };



  render() {
    const {
      showModel,
      validated,
      timezone,
      profile_image,
      profileImageError,
      username,
      note,
      email,
      name,
      errors,
      nameValidations,
      usernameValidations,
      is_cookie     
    } = this.state;
    const department = get(this.state, 'user_workspace_relationships[0].Department.name', '');

    console.log('data in props',is_cookie , this.props)

    // if (this.props.store.user && this.props.store.user.hasOwnProperty('response')) {
    //   const response = this.props.store.user.response;
    //   console.log('response in login comp', response);
    //   if (!response.success ) {
    //     const errors = response.errors[0].message || response.errors[0];
    //     toast.error(`ERROR: ${errors}!`);

    //   }
    // }
    // if(!this.state.profile_image) this.fetchUserDetails();

    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <h3 className="mt-4 mb-3">Your Profile</h3>
              <div className="manage-profile mb-4 p-4 bg-white">
                <Form onSubmit={this.handleSubmit} noValidate validated={validated}>
                  <Form.Group as={Row} className="mt-3 pb-3">
                    <Col md={{ span: 2, offset: 4 }} className="text-center">
                      <div className="profile-avator">
                        <Image src={this.state.profile_image} roundedCircle alt="avatar" />
                        <span className="profile-avator__icon" onClick={this.handleShow}>
                          <i className="fas fa-pen" />
                        </span>
                      </div>
                      <Form.Label column className="text-muted">
                        @{username}{' '}
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              It's your username used for referring your name in channel or files-shared or notes
                              section
                            </Tooltip>
                          }
                        >
                          <i className="fas fa-info-circle" />
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control type="hidden" name="profileImage" value={profile_image} />

                      <Modal show={showModel} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Change Avatar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="profile-avator"
                                required
                                onChange={this.handleFileUpload}
                              />
                              <label className="custom-file-label">Choose file</label>
                            </div>
                          </div>
                          <Form.Control.Feedback type="invalid" className={profileImageError ? 'd-block mt-3' : ''}>
                            {profileImageError}
                          </Form.Control.Feedback>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="outline-primary" onClick={this.handleClose}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={this.handleUploadAvatar}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="profile-name">
                    <Form.Label column sm={3}>
                      Full Name
                    </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="name"
                        aria-label="name"
                        pattern=".{2,50}"
                        required
                        value={name}
                        isInvalid={nameValidations}
                        onChange={this.handleChange}
                        autoComplete='off'
                      />
                      <Form.Control.Feedback type="invalid">Full Name must be between 8 to 60 characters.</Form.Control.Feedback>

                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="profile-name">
                    <Form.Label column sm={3}>
                      Username
                    </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="username"
                        aria-label="username"
                        required
                        value={username}
                        isInvalid={usernameValidations}
                        onChange={this.handleChange}
                      />
                      <Form.Control.Feedback type="invalid">Username must be within 7 characters length</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">Only Alphanumeric allowed, No special character except _ allowed</Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="profile-email">
                    <Form.Label column sm={3}>
                      Email
                    </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="username@example.com"
                        aria-label="email"
                        required
                        value={email}
                        disabled
                        readOnly
                        onChange={this.handleChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="profile-department">
                    <Form.Label column sm={3}>
                      Department
                    </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="text"
                        name="departmentId"
                        placeholder="Department"
                        aria-label="department"
                        pattern=".{4,50}"
                        value={department}
                        disabled
                        readOnly
                      />
                      <div className="mt-1 text-muted">Only your Workspace Admin can edit this!</div>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="profile-timezone">
                    <Form.Label column sm={3}>
                      Timezone
                    </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        as="select"
                        name="timezone"
                        aria-label="timezone"
                        value={timezone}
                        onChange={this.handleChange}
                      >
                        {Timezone.map((item, i) => (
                          <option value={item.utc[0]} key={i}>
                            {item.text}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="profile-cloud-storage">
                    <Form.Label column sm={3}>
                      Default File Storage
                    </Form.Label>
                    <Col sm={5}>
                      <div className="cc-selector">
                        <input
                          id="GOOGLE-DRIVE"
                          type="radio"
                          name="fileUpload"
                          value="GOOGLE-DRIVE"
                          checked={this.state.cloud_storage === 'GOOGLE-DRIVE'}
                          onChange={this.handleOptionChange}
                        />
                        <label
                          className="drinkcard-cc GOOGLE-DRIVE"
                          htmlFor="GOOGLE-DRIVE"
                          title="Google Drive"
                        ></label>
                        <input
                          id="DROPBOX"
                          type="radio"
                          name="fileUpload"
                          value="DROPBOX"
                          checked={this.state.cloud_storage === 'DROPBOX'}
                          onChange={this.handleOptionChange}
                        />
                        <label className="drinkcard-cc DROPBOX" htmlFor="DROPBOX" title="Dropbox"></label>
                      </div>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="profile-cloud-storage">
                    <Form.Label column sm={3}>
                      Cookies
                    </Form.Label>
                    <Col sm={5}>
                      <Form.Check 
                        type="switch"
                        id="custom-switch"
                        name='is_cookie'
                        label="Check this switch"
                        value={is_cookie}
                        checked={is_cookie}
                        onChange={this.handleCookiesChange}
                    />
                    {/* <div className="sidebar__userheader--toggle_status">
                      <label className={c_availability ? 'toogle-switch' : 'toogle-switch inactive'}>
                        <input
                          type="checkbox"
                          name="toggleStatus"
                          // defaultChecked={availability}
                          // value={availability}
                          checked={this.state.c_availability}
                          onChange={this.handleAvailability}
                          aria-label="toggle status"
                        />
                        <span className="toogle-slider" />
                      </label>
                    </div> */}
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Col sm={{ span: 9, offset: 3 }}>
                      <Button type="submit" onClick={this.handleSubmit}>
                        Save
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>

                {/* <Row>
                  <Col>
                    <h5>Subscribed Channels</h5>
                    <ul className="profile_subscribed">
                      <li>
                        <span>
                          <Image src="https://via.placeholder.com/30" roundedCircle alt="channel" />
                        </span>
                        <span>Frontend Deverloper</span>
                        <span className="custom-icon-check">
                          <input type="checkbox" className="far fa-envelope" />
                        </span>
                        <span className="custom-icon-check">
                          <input type="checkbox" className="fas fa-ban" />
                        </span>
                      </li>
                    </ul>
                  </Col>
                </Row> */}
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserProfileAction,
      getUserDataAction,
    },
    dispatch,
  );
};

const mapStateToProps = store => ({
  store,
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfile);