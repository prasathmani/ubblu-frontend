import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const ConfirmDialog = props => {
  return (
    <Modal show={props.show} onHide={props.cancelModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.title || 'Confirm'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message || 'Are you sure you want to this?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.cancelModal}>
          {props.lableNo || 'Cancel'}
        </Button>
        <Button variant={props.variantYes || 'primary'} onClick={props.saveModal}>
          {props.lableYes || 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
