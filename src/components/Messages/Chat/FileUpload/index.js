import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Modal, Button, Form } from 'react-bootstrap';
import { getFileType } from 'common/utils/';

import './index.scss';
/**
 * dummy event for cancel the fileupload modal prview
 */
const dunnmy_event = {
  currentTarget: {
    dataset: {
      action: 'fileupload-cancel',
    },
  },
};

/**
 * Set multiple attributes to element
 * @param {Element} el
 * @param {Object} attrs
 */
const setAttributes = (el, attrs) => {
  Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
};

/**
 * Render image file preview
 * @param {Object} files
 * @param {Function} events
 */
const filePreview = function (files, events) {
  if (files) {
    for (let i = 0; i < files.length; i++) {
      let file = files[i],
        listElm = document.createElement('li'),
        actionBtn = document.createElement('button'),
        fileName = document.createElement('span');
      actionBtn.textContent = 'Remove';

      setAttributes(actionBtn, {
        class: 'text-danger btn btn-link',
        'data-action': 'fileupload-remove',
        'data-name': file.name,
      });

      //Register events
      actionBtn.addEventListener('click', function (evt) {
        events(evt, null);
      });

      fileName.textContent = file.name;

      if (file && file['type'].split('/')[0] === 'image') {
        let reader = new FileReader();
        reader.onload = function (event) {
          let imgElm = document.createElement('img');
          imgElm.setAttribute('src', event.target.result);
          listElm.append(imgElm);
          listElm.append(fileName);
          listElm.append(actionBtn);

          document.querySelector('.js-img-preview').appendChild(listElm);
        };
        reader.readAsDataURL(file);
      }
    }
  }
};

/**
 * seprate the images and other files into two arrays
 * @param {Object} props
 */
const FileUpload = props => {
  const { events, filesList } = props;
  let fileDescription = null;
  document.querySelector('.js-img-preview') && (document.querySelector('.js-img-preview').innerHTML = '');
  let imgList = [],
    docList = [],
    filesCount = 0;

  filesList.map(file => {
    if (file) {
      if (file['type'].split('/')[0] === 'image') {
        imgList.push(file);
      } else {
        docList.push(file);
      }
    }
    filesCount++;
    return imgList;
  });


 const  onChange = (text) => {
    fileDescription = text;
  }

  return (
    <Modal size="lg" show={true} onHide={e => events(dunnmy_event, null)} keyboard={true} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Upload a File</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <Form.Control as="textarea" onChange={e => onChange(e.target.value)} noresize="true" rows="3" placeholder="Add a message about the file" />
        </div>
        <div className="file-previewer">
          <Scrollbars autoHeight autoHeightMin={60} autoHeightMax={300}>
            <ul className="js-img-preview">{filePreview(imgList, events)}</ul>
            <ul className="js-file-preview">
              {docList.map((file, key) => (
                <li key={key}>
                  <i className="far fa-file-alt" />
                  <span className={getFileType(file)}>{file.name}</span>
                  <Button
                    variant="link"
                    className="text-danger"
                    data-action="fileupload-remove"
                    data-name={file.name}
                    onClick={e => events(e, null)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </Scrollbars>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <span className="mr-auto">
          <Button variant="link" size="sm" data-action="fileupload-add" onClick={e => events(e, null)}>
            Add file
          </Button>
          (<span id="js-files-count">{filesCount}</span> of 10 selected)
        </span>
        <Button variant="outline-primary" data-action="fileupload-cancel" onClick={e => events(e, null)}>
          Close
        </Button>
        <Button variant="primary" data-action="fileupload-save" onClick={e => events(e, fileDescription)}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FileUpload;
