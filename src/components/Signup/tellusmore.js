import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import { TELLUS_DATA } from './data.js';
import store from 'store';
import { getCookie, getURLParameter, setCookie } from 'common/utils';
import { signupWatcher5 } from 'store/actions';
import { ROUTES } from 'common/constants';

class TellUsMore extends Component {
  constructor(props) {
    super(props);
    this.loading = false;
    this.errors = '';
    this.state = {
      workspaceId: getURLParameter('wid') || null,
      isShowRole: false,
      isShowIndustry: false,
    };
  }

  componentDidMount() {
    if (!getCookie('at')) {
      store.dispatch(push(ROUTES.SIGNUP));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.response.signup && nextProps.response.signup.hasOwnProperty('response')) {
      const responseData = nextProps.response.signup.response;
      if (responseData.success && responseData.data.status === 1) {
        if (this.state.workspaceId) {
          setCookie('wid', this.state.workspaceId, 1);
        }
      }
    }
    return true;
  }

  handleToggleInput = (type, event) => {
    const _selectedValue = event.target.value;
    if (type === 'role') {
      if (_selectedValue === 'Others') {
        this.setState(oldState => ({ isShowRole: !oldState.isShowRole }));
      } else {
        this.setElementValue('input[name="companyRoleOthers"]');
        this.setState({ isShowRole: false });
      }
    } else if (type === 'industry') {
      if (_selectedValue === 'Others') {
        this.setState(oldState => ({ isShowIndustry: !oldState.isShowIndustry }));
      } else {
        this.setElementValue('input[name="companyIndustryOthers"]');
        this.setState({ isShowIndustry: false });
      }
    }
  };

  gotTo = event => {
    event.preventDefault();
    store.dispatch(push(ROUTES.MESSAGES));
  };

  getElementValue(el) {
    return document.querySelector(el) ? document.querySelector(el).value : '';
  }

  setElementValue(el, value = '') {
    return document.querySelector(el) ? (document.querySelector(el).value = value) : false;
  }

  getFormData() {
    let _companyRole = this.getElementValue('select[name="companyRole"]');
    const _companyRoleOthers = this.getElementValue('input[name="companyRoleOthers"]');
    let _companyIndustry = this.getElementValue('select[name="companyIndustry"]');
    const _companyIndustryOthers = this.getElementValue('input[name="companyIndustryOthers"]');
    const _teamSize = this.getElementValue('select[name="sizeOfTeam"]');
    const _howFind = this.getElementValue('input[name="howFind"]');
    _companyRole = _companyRoleOthers ? _companyRoleOthers : _companyRole;
    _companyIndustry = _companyIndustryOthers ? _companyIndustryOthers : _companyIndustry;
    let obj = {
      companyRole: _companyRole,
      companyIndustry: _companyIndustry,
      sizeOfTeam: _teamSize,
      howFind: _howFind,
      workspaceId: this.state.workspaceId,
    };
    return JSON.stringify(obj);
  }

  handleSubmit = event => {
    event.preventDefault();
    this.loading = true;
    this.getFormData();
    if (this.getFormData()) {
      console.log('tttt', this.getFormData())
      this.props.signupWatcher5(this.getFormData());
      this.gotTo(event);
    } else {
      this.gotTo(event);
    }
  };

  render() {
    const { SELECT_LIST_1_VALUE, SELECT_LIST_2_VALUE, SELECT_LIST_3_VALUE } = TELLUS_DATA;

    //handle the api response
    if (this.props.response.signup && this.props.response.signup.hasOwnProperty('response')) {
      const userData = this.props.response.signup.response;
      if (!userData.success || userData.data.status === 0) {
        this.loading = false;
        this.errors = userData.message;
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Signup - Create your Workspace</div>
        <Form className="auth__layout__form tell_us" onSubmit={this.handleSubmit}>
          <Form.Label>{TELLUS_DATA.HEADING}</Form.Label>

          <div className="tell_us__list mt-2">
            <Form.Group as={Row}>
              <Form.Label column sm={5}>
                {TELLUS_DATA.SELECT_LIST_1}
              </Form.Label>
              <Col sm={7}>
                <Form.Control
                  as="select"
                  name="companyRole"
                  onChange={e => {
                    this.handleToggleInput('role', e);
                  }}
                >
                  <option value="">Select from any of below</option>
                  {SELECT_LIST_1_VALUE.map(function(d, i) {
                    return (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    );
                  })}
                </Form.Control>
                {this.state.isShowRole ? (
                  <Form.Control
                    type="text"
                    name="companyRoleOthers"
                    placeholder="Specify"
                    pattern=".{1,500}"
                    className="mt-1"
                  />
                ) : null}
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={5}>
                {TELLUS_DATA.SELECT_LIST_2}
              </Form.Label>
              <Col sm={7}>
                <Form.Control
                  as="select"
                  name="companyIndustry"
                  onChange={e => {
                    this.handleToggleInput('industry', e);
                  }}
                >
                  <option value="">Select from any of below</option>
                  {SELECT_LIST_2_VALUE.map(function(d, i) {
                    return (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    );
                  })}
                </Form.Control>

                {this.state.isShowIndustry ? (
                  <Form.Control
                    type="text"
                    name="companyIndustryOthers"
                    placeholder="Specify"
                    pattern=".{1,500}"
                    className="mt-1"
                  />
                ) : null}
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={5}>
                {TELLUS_DATA.SELECT_LIST_3}
              </Form.Label>
              <Col sm={7}>
                <Form.Control as="select" name="sizeOfTeam">
                  <option value="">Select from any of below</option>
                  {SELECT_LIST_3_VALUE.map(function(d, i) {
                    return (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Form.Group>
          </div>

          <Form.Group controlId="formBasicEmail" className="mt-4">
            <Form.Label>Is your company using any of these team chat applications</Form.Label>
            <div className="mb-3">
              <Form.Check custom inline label="Slack" type="checkbox" id="01" />
              <Form.Check custom inline label="Flock" type="checkbox" id="02" />
              <Form.Check custom inline label="Microsoft Teams" type="checkbox" id="03" />
              <Form.Check custom inline label="Twist" type="checkbox" id="04" />
              <Form.Check custom inline label="Discord" type="checkbox" id="05" />
              <Form.Check custom inline label="Mattermost" type="checkbox" id="06" />
            </div>
          </Form.Group>

          <Form.Group controlId="formBasicEmail" className="mt-4">
            <Form.Label>{TELLUS_DATA.QESTION_1}</Form.Label>
            <Form.Control type="text" name="howFind" placeholder="Google or colleague or others" />
          </Form.Group>

          <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block mt-3' : ''}>
            {this.errors}
          </Form.Control.Feedback>

          <Row>
            <Col>
              <p className="pt-4">
                <a href="#/app" role="button" className="text-muted" onClick={this.gotTo}>
                  {TELLUS_DATA.SKIP_BTN}
                </a>
              </p>
            </Col>
            <Col>
              <Button variant="primary" type="submit" aria-label={TELLUS_DATA.SUBMIT_BTN} disabled={this.loading}>
                {TELLUS_DATA.SUBMIT_BTN}
                &nbsp;&nbsp;
                <span
                  className={this.loading ? 'spinner-border spinner-border-sm' : 'hide'}
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signupWatcher5,
      // add other watcher sagas to this object to map them to props
    },
    dispatch,
  );
};

const mapStateToProps = response => ({
  response,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TellUsMore);
