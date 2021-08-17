import './index.scss'
import React from 'react';

const SuggestionOverlay = ({message = 'Type and press enter to proceed', children, customClasses})=> {
    return (
        <div className={`suggestion-overlay ${customClasses}`}>
            {message}
            {children}
        </div>
    );
}

export default SuggestionOverlay;