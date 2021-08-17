import React from 'react';
import { Modal } from 'react-bootstrap';

const WorkspaceMap = props => (
  <Modal show={props.showWorkspaceMap} onHide={props.handleModelClose}>
    <Modal.Header closeButton>
      <Modal.Title>Select your workspace</Modal.Title>
    </Modal.Header>
    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
  </Modal>
);

export default WorkspaceMap;
