import React from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment'

import { textEllipsis, textNoteEllipsis } from 'common/utils';

const NotesListItem = ({ note, editNotes, deletNoteNotification }) => (
  <li className="notes-list-item">
   
    <Form.Check
      key={note.id}
      custom
      id={note.id}
      type="checkbox"
      checked={note.deleted ? true : false}
      label=""
      onClick={() => (note.deleted ? editNotes(note.notes, note.id, note.deleted) : deletNoteNotification(note.id, note.deleted))}
    />
    <div className="notes-wrapper">
      <p class="text-box notes-title">
        
        {note.deleted ? (
          <del>
            {/* {textEllipsis(note.notes, 77)} */}
            {note.notes.length > 80 ? `${note.notes.substring(0, 73)}...` : note.notes}
          </del>
        ) : (
            <span onClick={() => editNotes(note.notes, note.id, note.deleted)}> {note.notes.length > 80 ? `${note.notes.substring(0, 73)}...` : note.notes}</span>
          )}
      </p>

      <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-secret`}>{note.name}</Tooltip>}>
        <span className="text-muted notes-username">
         <a href="javascript:void(0)">{note.username}</a>
        </span>
      </OverlayTrigger>

      <span className="text-muted notes-timestamp">
      {moment(note.updated_at).format('YYYY-MM-DD HH:mm:ss') === moment(note.created_at).format('YYYY-MM-DD HH:mm:ss')?      
      moment().format('MM-DD-YYYY') === moment(note.created_at).format('MM-DD-YYYY') ? moment(note.created_at).format('HH:mm') : moment(note.created_at).format('MM/DD/YYYY'):
      <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-date`}>Edited</Tooltip>}>
       <a href="javascript:void(0)"> {moment().format('MM-DD-YYYY') === moment(note.created_at).format('MM-DD-YYYY') ? moment(note.created_at).format('HH:mm') : moment(note.created_at).format('MM/DD/YYYY')}</a>
      </OverlayTrigger>}
      </span>
    </div>
    {note.deleted ? (
      <span className="icon-wrapper">
      <del>
        <span className="text-muted float-right">
          <i className="fa fa-trash" onClick={() => deletNoteNotification(note.id, note.deleted)} />
        </span>
      </del>
      </span>
    ) : (
      <span></span>
    )}
  </li>
);

export default NotesListItem;
