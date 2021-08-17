import { Button } from 'react-bootstrap';
import { InboxLoader } from './inboxLoader';
import InboxSearch from './inboxSearch';
import NewConversation from 'components/Messages/NewConversation';
import React from 'react';

export class TabPane extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showConversation: false,
    };
  }

  handleShow = () => {
    this.setState({ showConversation: true }, () => {
      console.log(this.state.showConversation);
    });
  };

  handleHide = () => {
    this.setState({ showConversation: false });
  };

  render() {
    const { loading, inboxList, children } = this.props;
    const { props } = children;
    let userWorkspaceRelationship;
    if (props.userWorkspaceRelationship) {
      userWorkspaceRelationship = props['userWorkspaceRelationship'];
    }
   
    return (
      <div className="c-inbox">
        <div className="c-inbox__people">
          <InboxSearch filter={this.props.filter}/> 

          <div className="c-inbox__chat">
            {loading ? [...Array(6)].map((x, i) => <InboxLoader key={i} />) : <>{children}</>}
          </div>
          {userWorkspaceRelationship && userWorkspaceRelationship != 'GUEST USER' ?
            <div className="c-inbox__new-conversation">
              <Button
                variant="primary"
                onClick={() => {
                  this.handleShow();
                }}
              >
                <i className="fas fa-plus"></i> New 
            </Button>
            </div> : null}

          <NewConversation show={this.state.showConversation} directUsers={[]} handleHide={this.handleHide} />
        </div>
      </div>
    );
  }
}
