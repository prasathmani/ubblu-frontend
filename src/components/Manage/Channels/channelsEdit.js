import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';


import React, { useState } from 'react';
import { channel } from 'redux-saga';

let channelType = 'PUBLIC';

const onSelectChannelType = (channelType) => {
  channelType = channelType
}
const ChannelsEdit = props => {
  console.log('props for edit channel', props.channel);
  channelType = props.channel.channel_type;

  const [namecnt, setNameCnt] = useState(0)
  const [descnt, setDesCnt] = useState(0)

  const txtCounter = (e) => {
    if (e.target.name === 'name') {
      if (e.target.value) {
        setNameCnt(e.target.value.length)
      }
      else { setNameCnt(0) }
    }
    else {
      if (e.target.value) {
        setDesCnt(e.target.value.length)
      }
      else { setDesCnt(0) }
    }
  }

  return (
    <div>
      <Form method="Post" onSubmit={props.action}>
        <input type="hidden" name="channelId" value={props.channel.id} />
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Name" onKeyUp={(e) => txtCounter(e)} defaultValue={props.channel.name} maxLength="70" />
          {/* <span>{namecnt}/70</span> */}
          <span className="text-right d-block">{namecnt === 0 && props.channel.name ? props.channel.name.length : namecnt}/70</span>
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" onKeyUp={(e) => txtCounter(e)} rows="3" defaultValue={props.channel.description} maxLength="120" />
          {/* <span>{descnt}/120</span> */}
          <span className="text-right d-block">{descnt === 0 && props.channel.description ? props.channel.description.length : descnt}/120</span>
        </Form.Group>

        <Form.Group className="pb-3 " data-id="channel_auto_join">
          <Form.Label>Auto Join</Form.Label>
          <Form.Control as="select" name="autoJoin" defaultValue={props.channel.auto_join}>
            <option value="NONE">NONE</option>
            <option value="ANYONE">ANYONE</option>
            <option value="ANY GUEST USER">ANY GUEST USER</option>
            <option value="ANY EMPLOYEE">ANY EMPLOYEE</option>
          </Form.Control>
        </Form.Group>

        <Form.Group data-id="channel_type">
          <Form.Label>Type</Form.Label>
          <div className="mb-3">

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-public`}>Public channel can be joined by anyone!</Tooltip>}
            >
              <Form.Check inline name="channelType" value="PUBLIC" label="Public" type="radio" id="type-1" defaultChecked = { props.channel.channel_type === 'PUBLIC' ? true: false}
                onChange={(e) => { onSelectChannelType(e.target.value) }}
              />
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-private`}>
                  Private channel can be joined if they have channel invite link as well as if a channel admin adds him!
                </Tooltip>
              }
            >
              <Form.Check inline name="channelType" value="PRIVATE" label="Private" type="radio" id="type2"
              defaultChecked = { props.channel.channel_type === 'PRIVATE' ? true: false}
                onChange={(e) => { onSelectChannelType(e.target.value) }}
              />
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-secret`}>
                  Secret channel can't be joined unless the channel admin manually adds the user!
                </Tooltip>
              }
            >
              <Form.Check inline name="channelType" value="RESTRICTED" label="Secret" type="radio" id="type-3"
              defaultChecked = { props.channel.channel_type === 'RESTRICTED' ? true: false}
                onChange={(e) => { onSelectChannelType(e.target.value) }}
              />
            </OverlayTrigger>

          </div>
        </Form.Group>

        <Form.Group className="row mt-4">
          <Col sm="12" className="text-right">
            <Button variant="outline-primary" type="submit" name="editChannelBtn">
              Update Channel
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default ChannelsEdit;
