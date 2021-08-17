import React, { Component, useState } from 'react';
import { Container, Col, Row, Button, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { WORKSPACEID } from 'common/utils/helper';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changePwdAction } from 'store/actions';
import { changePassword } from 'store/api';
import { push } from 'connected-react-router';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      flag:true,
    }
  }

  handleChange = (e) => {
    console.log('e.target.value',e.target.value);
    var strongRegex = new RegExp("^(?=.{4,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.name === 'newPassword') {    
        if(!strongRegex.test(e.target.value)){
        document.querySelector('#newPassword').innerHTML = 'Password must contain one lowercase, one uppercase, one numeric and one special character';
        this.setState({flag:false});
      }    
      else{
        document.querySelector('#newPassword').innerHTML = ''; 
         if(this.state.confirmPassword === e.target.value){          
          document.querySelector('#confirmPassword').innerHTML = ''; 
        }       
        this.setState({flag:true});
       
      }
    }
    

    if (e.target.name === 'confirmPassword') {

      if(!strongRegex.test(e.target.value)){
        document.querySelector('#confirmPassword').innerHTML = 'Password must contain one lowercase, one uppercase, one numeric and one special character';
        this.setState({flag:false});
      }
      else if (this.state.newPassword !== e.target.value) {
        //console.log('strongRegex.test(e.target.value)',strongRegex.test(e.target.value));
       
        document.querySelector('#confirmPassword').innerHTML = 'Confirmed password should match with new password1';
        this.setState({flag:false});
      }      
      else {
        this.setState({flag:true});
        document.querySelector('#confirmPassword').innerHTML = '';
      }
    }

  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.newPassword !== this.state.confirmPassword ) {
      document.querySelector('#confirmPassword').innerHTML = 'Confirmed password should match with new password';
    }
   else if (this.state.newPassword === this.state.confirmPassword && this.state.flag==false) {
      document.querySelector('#confirmPassword').innerHTML = 'Password must contain one lowercase, one uppercase, one numeric and one special character';
    }
    else {
      document.querySelector('#confirmPassword').innerHTML = '';
      changePassword({
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword,
      }).then(resp => {
        if (resp.success && resp.data.status === 1) {
          toast.success('Password has been changed')
          this.setState({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
        else {
          toast.error(resp.errors[0])
        }
      }).catch(err => {
        toast.error('Password has not been changed')
      })
      console.log('Final response=>', this.props.response);
    }


  };

  render() {
    const { currentPassword, newPassword, confirmPassword } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <h3 className="mt-4 mb-3">Change Password </h3>
              <div className="manage-profile mb-4 p-4 bg-white">
                <Form id="cngPwd" onSubmit={(e) => this.handleSubmit(e)} ref={el => (this.myFormRef = el)}>
                  <Form.Group as={Row} controlId="profile-name">
                    <Form.Label column sm={3}>
                      Current Password
                  </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        aria-label="name"
                        pattern=".{2,50}"
                        value={currentPassword}
                        onChange={(e) => this.handleChange(e)}
                        required
                      />
                      <span className="currentPassword_errorMsg" style={{ "color": "red" }}></span>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="profile-name">
                    <Form.Label column sm={3}>
                      New Password
                  </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        aria-label="name"
                        pattern=".{2,50}"
                        value={newPassword}
                        onChange={(e) => this.handleChange(e)}
                        required
                      />
                       <span id="newPassword" className="newPassword_errorMsg" style={{ "color": "red" }}></span>
                     
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="profile-name">
                    <Form.Label column sm={3}>
                      Confirm Password
                  </Form.Label>
                    <Col sm={5}>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Retype New Password"
                        aria-label="name"
                        pattern=".{2,50}"
                        value={confirmPassword}
                        onChange={(e) => this.handleChange(e)}
                        required
                      // onChange={(input) => this.handleChange(input.target.name, input.target.value)}
                      />
                      <span id="confirmPassword" className="confirmPassword_errorMsg" style={{ "color": "red" }}></span>
                    </Col>
                  </Form.Group>
                  <Form.Group>
                    <Col lg={6} >
                      <Button type="submit" name="changePasswordBtn">
                        Save
                    </Button>
                    </Col>
                  </Form.Group>
                </Form>
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
      changePwdAction,
      push
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
