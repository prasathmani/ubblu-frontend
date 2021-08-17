import './index.scss';

import { Button, Card, CardColumns, Col, Container, Modal, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import { API } from 'common/constants';
import AddNewWorkspace from './addNewWorkspace';
import Avatar from 'components/Avatar';
import { WORKSPACEID } from 'common/utils/helper';
import { getMyWorkspace } from 'store/api';

class MyWorkspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: WORKSPACEID(),
      workspace: [],
      showNewWorkspaceModal: false,
    };
  }

  componentDidMount() {
    this.renderWorkspaceList();
  }

  handleNewWorkspaceModal = () => {
    this.setState(prevState => ({
      showNewWorkspaceModal: !prevState.showNewWorkspaceModal,
    }));
  };

  renderWorkspaceList = () => {
    getMyWorkspace()
      .then(response => {
        if (response.success && response.data.status === 1) {
          this.setState({
            workspace: response.data.workspace,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const { workspace } = this.state;
    return (
      <React.Fragment>
        <Container className="my-workspace">
          <Row>
            <Col>
              <h4 className="mt-4 mb-4">Your Signed-In Workspaces</h4>

              <CardColumns>
                {workspace &&
                  workspace.map(ws => (
                    <Card className="text-center" key={ws.id}>
                      <div className="mt-3">
                        <Avatar
                          as="span"
                          userid={ws.id}
                          src={`${API.AVATAR}?s=48&name=${ws.name}`}
                          alt={ws.name}
                          className="rounded-circle"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>{ws.name}</Card.Title>
                        <Card.Text className="text-muted">{`ubblu.ga/${ws.name}`}</Card.Text>
                        <div className="my-workspace__actions">
                          <Button variant="primary" className="mr-2">
                            Sign In
                          </Button>
                          <Button variant="outline-primary">Remove</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}

                <Card className="text-center">
                  <Card.Body>
                    <Button variant="link" className="mt-5 mb-5" onClick={this.handleNewWorkspaceModal}>
                      <i className="fas fa-plus-circle fa-3x" />
                      <div className="pt-2">Sign in to a New Workspace</div>
                    </Button>
                  </Card.Body>
                </Card>
              </CardColumns>
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.showNewWorkspaceModal} onHide={this.handleNewWorkspaceModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sign-In to New Workspace</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddNewWorkspace close={this.handleNewWorkspaceModal} />
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default MyWorkspace;
