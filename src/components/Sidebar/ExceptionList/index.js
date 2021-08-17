import React, { useRef, useState } from 'react';
import get from 'lodash/get';
import { Button, Modal, Accordion, Card, Form } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { toast } from 'react-toastify';
import { WORKSPACEID, USERID } from 'common/utils/helper';

import './index.scss';

import { searchUsersByName, searchUsersChannelByName } from 'store/api';

function ExceptionList(props) {
  const [show, setShow] = useState(false);
  const [list, setList] = useState({ userIds: [], channelIds: [] });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveExceptionList = () => {
    props.saveExceptionList(list, handleClose);
  };

  let exceptionlist = [];

  React.useEffect(() => {
    setList({ ...props.list });
  }, [props.list]);

  const onChange = (type, id) => {
    let updatedList = list[type];
    if (updatedList.includes(id)) updatedList = updatedList.filter(l => l !== id);
    else updatedList.push(id);
    setList({ ...list, [type]: updatedList });
    exceptionlist.push(id);
  };


  let channelsList = [];
  let usersList = [];
  if (props.channelsList) {
    props.channelsList.map(channel => {
      if (channel.channel_type == 'PERSONAL') {
        usersList.push(
          <li key={channel.channel_id}>
            <Form.Check
              onChange={() => onChange('channelIds', channel.channel_id)}
              checked={list.channelIds.includes(channel.channel_id)}
              custom
              type="checkbox"
              id={channel.channel_id}
              label={channel.name}
            />{' '}
          </li>,
        );
      } else {
        channelsList.push(
          <li key={channel.channel_id}>
            <Form.Check
              checked={list.channelIds.includes(channel.channel_id)}
              onChange={() => onChange('channelIds', channel.channel_id)}
              custom
              type="checkbox"
              id={channel.channel_id}
              label={channel.name}
            />
          </li>,
        );
      }
    });
  }
  return (
    <>
      <button className="btn-unstyled" title="Exception List" onClick={handleShow}>
        <i className="fas fa-user-alt-slash" title="Exception List" />
        <i className="fas fa-caret-down"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Exception List</Modal.Title>
        </Modal.Header>
        <Modal.Body className="c-exceptionlist">
          <div>
            <div className="input-group">
                  <input type="search" className="form-control" placeholder="Add person or channel"  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
            </div>
          </div>
          <div className="mt-3">
            <Accordion defaultActiveKey="0">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Persons
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <ul>
                      <Scrollbars autoHide autoHeight autoHeightMin={80} autoHeightMax={240}>
                        {usersList}
                      </Scrollbars>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Channels
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul>
                      <Scrollbars autoHide autoHeight autoHeightMin={80} autoHeightMax={240}>
                        {channelsList}
                      </Scrollbars>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => {
              saveExceptionList();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ExceptionList;
