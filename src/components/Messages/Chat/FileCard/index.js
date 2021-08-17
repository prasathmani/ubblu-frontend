import './index.scss'
import React from 'react';

const FileCard = (props)=> {
  const {files:{fileName = 'No file name'}, onDownload, customClasses, children} = props
  return (
    <div className={`file-card ${customClasses}`}>
      <div className='file-card--content'>
        <div className='file-card--content--filename'>{fileName}</div>
        <div className='file-card--content--upload'>Upload Complete</div>
        <div className='file-card--content--file-icon'>
          <i className="fa fa-file" aria-hidden="true"></i>
          <span>File</span>
        </div>
        <hr/>
        <div className='file-card--content--download'>
          <span onClick={(e)=>{
            e.currentTarget.dataset.action = "download-file";
            onDownload(e);
          }}>Download</span>
        </div>
      {children}
      </div>
    </div>
  );
}

export default FileCard;