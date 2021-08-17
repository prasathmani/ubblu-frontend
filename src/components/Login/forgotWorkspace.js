import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';
// import { forgotPwdAction } from 'store/actions';
import { push } from 'connected-react-router';
import { ROUTES } from 'common/constants';
import { getCookie } from 'common/utils';
import { findWorkspace } from 'store/api';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            enableLoader: false,
            success: false
        };

        this.errors = '';
        this.success = null;
    }

    componentDidMount() {
        if (getCookie('at')) {
            this.props.push(ROUTES.APP_ROOT);
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    sendForgotWorkspace = () => {
        findWorkspace(JSON.stringify({ email: this.state.email }), true).then(res => {
            this.setState({ success: true });
        }).catch(err => alert(`Error sending notification ${err}`));
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.state.email !== '') {
            this.errors = '';
            this.setState({ enableLoader: true }, this.sendForgotWorkspace);
        }
    };

    render() {
        const { enableLoader } = this.state;
        let isEmailChkSuccess = false,

            enableLoaderChk = enableLoader;

        if (this.props.response.login && this.props.response.login.hasOwnProperty('response')) {
            const response = this.props.response.login.response;
            enableLoaderChk = false;
            if (response.success) {
                this.success = true;
                isEmailChkSuccess = true;
                this.myFormRef.reset();
            } else {
                this.errors = response.errors;
            }
        }

        return (
            <React.Fragment>
                <div className="auth__layout__header text-center">Find Workspace</div>

                {this.state.success ? (
                    <Form className="auth__layout__form">
                        <span>
                            If an account with this email exists, then a workspace details email has been sent! Check your Inbox!
                        </span>
                    </Form>
                ) : (
                        <Form className="auth__layout__form" ref={el => (this.myFormRef = el)} onSubmit={this.handleSubmit}>
                            <Form.Label>To find your workspace, enter the registered email address</Form.Label>
                            <Form.Group controlId="loginForm" className="input-group mt-2">
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="workspace-name"
                                    aria-label="you@example.com"
                                    required
                                    onChange={this.handleChange}
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                />
                            </Form.Group>

                            <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block' : ''}>
                                {this.errors}
                            </Form.Control.Feedback>

                            <Button variant="primary" type="submit" aria-label="Get Reset Link" disabled={enableLoaderChk}>
                                <span
                                    className={enableLoaderChk ? 'spinner-grow spinner-grow-sm' : 'hide'}
                                    role="status"
                                    aria-hidden="true"
                                />
              Get Workspaces
            </Button>
                        </Form>
                    )}
            </React.Fragment>
        );
    }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            forgotPwdAction: () => { },
            push,
        },
        dispatch,
    );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
