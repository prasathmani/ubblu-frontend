import React, { Component } from 'react';
import { Container, Col, Row, Button, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { WORKSPACEID } from 'common/utils/helper';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import { manageEmailNotification, handleKeywords } from 'store/api';

import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

class EmailNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetKeywordModal: false,
      keywords: [],
      placeholder: 'keywords',
      workspaceId: WORKSPACEID(),
    };
    this.getUpdateKeywords();
  }

  getUpdateKeywords = async () => {
    let { data } = await handleKeywords(null, true);
    if (data) this.setState(prevState => ({
      keywords: data.split(',')
    }))
  }

  upateKeywords = async () => {
    let keywords = this.state.keywords.join(',');
    try {
      await handleKeywords(keywords);
      toast.success('Updated keywords');
    } catch (error) {
      toast.error('Error updating keywords');
    } finally {
      this.handleSetKeywordModal();
      this.getUpdateKeywords();
    }
  }

  handleSetKeywordModal = () => {
    this.setState(prevState => ({
      showSetKeywordModal: !prevState.showSetKeywordModal,
    }));
  };

  handleKeywords = keyword => {
    this.setState({ keywords: keyword });
  };

  handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let payload = Object.fromEntries(formData);
    const $submitBtn = e.target.emailSubmitBtn;
    if (payload) {
      payload.workspaceId = this.state.workspaceId;
      $submitBtn.disabled = true;

      manageEmailNotification(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: Notifications has been updated successfuly!');
            $submitBtn.disabled = false;
            //update the state
          } else {
            $submitBtn.disabled = false;
            toast.error(get(response, 'errors[message]', 'ERROR: some error occurred try again!'));
          }
        })
        .catch(error => {
          $submitBtn.disabled = false;
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  render() {
    const { placeholder, keywords } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <h3 className="mt-4 mb-3 mr-2 d-inline-block">Email Notifications</h3>
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            In ubblu, you receive an email notification: -When you receive a
                            direct message from any user -When someone quotes you or mentions your username/keyword in channel
                        </Tooltip>
                    }
                >
                    <i className="fas fa-info-circle" />
                </OverlayTrigger>
              <div className="manage-profile mb-4 p-4 bg-white">
                  <OverlayTrigger
                      placement="bottom"
                      overlay={
                          <Tooltip id={`tooltip-top`}>
                              Set your own personalized keywords. And, get notified when someone mentions them!
                          </Tooltip>
                      }
                  >
                      <h6 className="d-inline-block">Keywords{' '}</h6>
                  </OverlayTrigger>
                <Form method="POST" name="email-notification" onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <Button variant="primary" size="sm" onClick={this.handleSetKeywordModal}>
                      Set your keywords
                    </Button>
                  </Form.Group>

                  <Form.Group controlId="email.ControlInput1">
                    <Form.Label>Send me email notifications:</Form.Label>
                    <Form.Check
                      custom
                      type="radio"
                      name="email_notifications"
                      aria-label="radio 1"
                      label="Once every 15 minutes"
                      value={15}
                      id="email_notifications-1"
                    />
                    <Form.Check
                      custom
                      type="radio"
                      name="email_notifications"
                      aria-label="radio 2"
                      label="Once an hour at most"
                      value={60}
                      id="email_notifications-2"
                    />
                    <Form.Check
                      custom
                      type="radio"
                      name="email_notifications"
                      aria-label="radio 3"
                      label="Never"
                      value={false}
                      defaultChecked={true}
                      id="email_notifications-3"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Button type="submit" name="emailSubmitBtn">
                      Save
                    </Button>
                  </Form.Group>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>

        <Modal show={this.state.showSetKeywordModal} onHide={this.handleSetKeywordModal}>
          <Modal.Header closeButton>
            <Modal.Title>Set Keywords</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <Form.Group className="custom-tags-input col-12">
                <TagsInput
                  inputProps={placeholder}
                  value={keywords}
                  addKeys={[9, 13, 32, 186, 188]} // tab, enter, space, semicolon, comma
                  onlyUnique
                  addOnPaste
                  pasteSplit={data => {
                    return data
                      .replace(/[\r\n,;]/g, ' ')
                      .split(' ')
                      .map(d => d.trim());
                  }}
                  onChange={e => this.handleKeywords(e)}
                />
              </Form.Group>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.upateKeywords}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EmailNotifications;
