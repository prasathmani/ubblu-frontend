import './index.scss'
import React from 'react';

const Loader = ({customClasses, children})=> {
  return (
    <div className={`loader ${customClasses}`} >
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
        {children}
      </div>
    </div>
  );
}

export default Loader;