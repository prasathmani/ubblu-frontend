import React, { useState, createRef } from 'react';
import { getSearchOutput } from 'store/api';
import {
  getSearchResultsAction,
  clearSearchResultsAction,
  getDirectConversationsAction,
  clearDirectConversationsAction,
  getChannelConversationsAction,
  clearChannelConversationsAction,
  clearMutedConversationsAction,
  clearStarredConversationsAction,
  getStarredConversationsAction,
  getMutedConversationsAction,
} from 'store/actions';
import { bindActionCreators } from 'redux';
import { connect  } from 'react-redux';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router-dom';
import SuggestionOverlay from '../../Common/SuggestionOverlay/Index';

import { USERID, WORKSPACEID } from 'common/utils/helper';
import { isDesktopApp } from 'common/utils';


const InboxSearch = props => {
  const [filter, setfilter] = useState(null);
  const [searchInputText, setSearchInputText] = useState(null);
  const [filterList, setfilterList] = useState(null);
  const [show_clear, showClear] = useState(false);
  const [showInputOverlay, setInputOverlay] = useState(false);
  const [showToggleSearch, setToggleSearch] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showOnce, setShowOnce] = useState(true);


  
  let inputSearchRef = createRef();

  const handleSearchFilter = (e, type) => {
    console.log('handleSearchFilter', type);

    handleFilterList(false);
    setfilter(type);
    const userId = USERID();
    if (type === 'people') {
      props.getDirectConversationsAction(userId);
    } else if (type === 'channels') {
      props.getChannelConversationsAction(userId);
    } else if (type === 'starred') {
      props.getStarredConversationsAction(userId);
    } else if (type === 'muted') {
      props.getMutedConversationsAction(userId);
    }
  };

  // const toggleFilterView = () => {
  //   alert("ritts");
  //   setfilter(null);
  // };

  React.useEffect((e) => {
    if (isUpdate === false && props.filter === true) {
      setIsUpdate(true);
    }    
    
    //console.log("filter props.filter isUpdate",filter,props.filter,isUpdate);   
   
    if(filter !==false && props.filter === false && isUpdate===true){     
      setIsUpdate(false); 
      setfilter(false);
      showClear(false); 
      handleSearchFilterClose();
   }
    

  })
 


  

  const handleSearchFilterClose = () => {
  
    setfilter(null);
    setfilterList(null);
    if (inputSearchRef.current) inputSearchRef.current.value = '';
    props.clearSearchResultsAction();
    props.clearDirectConversationsAction();
    props.clearChannelConversationsAction();
    props.clearMutedConversationsAction();
    props.clearStarredConversationsAction();
  };

  const searchMessages = event => {
    if (event.key === 'Enter' && searchInputText != null && searchInputText.trim() != '') {
      if(showOnce){
        setInputOverlay(false);
        setShowOnce(false);
      }
      props.getSearchResultsAction({ searchString: searchInputText.trim() });
      props.clearDirectConversationsAction();
      props.clearChannelConversationsAction();
    } else {
      props.clearSearchResultsAction();
      props.clearDirectConversationsAction();
      props.clearChannelConversationsAction();
    }
  };

  const handleSearchInput = text => {
    setSearchInputText(text);
  };

  const registerEvents = () => {
    // Get arbitrary element with id "my-element"
    var myElementToCheckIfClicksAreInsideOf = document.querySelector('.filter-list');
    // Listen for click events on body
    document.body.addEventListener('click', function (event) {
      if (myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
        console.log('clicked inside');
      } else {
        console.log('clicked outside');
      }
    });
  };

  const handleFilterList = status => {
    setfilterList(status);
    //document.querySelector('.active').classList.remove('active');
  };

  const onFocus = e => {
    if (!searchInputText && showOnce) {
        setInputOverlay(true);
    }
  };

  const onBlur = e => {
    if (showInputOverlay) {
      setInputOverlay(false);
    }
  };

  const handleSearchToggle = () => setToggleSearch(!showToggleSearch);

  return (
    <div className="c-inbox__search">
      {isDesktopApp() && (
        <button type="button" className="c-inbox__search--desktop-app" onClick={handleSearchToggle}>
          <i className="fa fa-search" aria-hidden="true" />
        </button>
      )}
      <div
        className={`c-inbox__search--wrapper ${showInputOverlay ? 'bottom-radius-none' : ''} ${
          showToggleSearch ? 'deskapp-show' : ''
        }`}
      >
        <div className="c-inbox__search--group">
          <span className="input-group-addon">
            <button type="button">
              <i className="fa fa-search" aria-hidden="true" />
            </button>
          </span>
          <input
            type="text"
            name="search"
            className="form-control c-inbox__search--bar"
            ref={inputSearchRef}
            placeholder="/ to start search"
            onChange={e => {
              if (e.target.value === '') showClear(false);
              else showClear(true);
              handleSearchInput(e.target.value);
            }}
            onKeyDown={event => {
              searchMessages(event);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {show_clear && (
            <span
              className="close"
              onClick={e => {
                if(showInputOverlay && showOnce){
                  setInputOverlay(false);
                  setShowOnce(false);
                }
                setSearchInputText('');
                handleSearchFilterClose(e, null);
                showClear(false);
              }}
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
            </span>
          )}
          {!filterList && !filter && (
            <button
              className="js-search-filter"
              onClick={e => {
                handleFilterList(true);
              }}
            >
              <i className="fas fa-filter"></i>
            </button>
          )}
          <span className={`c-inbox__search--custom-placeholder ${filter && 'selected'}`}>
            {filter && (
              <span
                className={`js-search-${filter === 'starred' ? 'stared' : filter} selected`}
                onClick={e => {
                  handleSearchFilterClose(e, null);
                }}
              >
                {` ${filter} `}
              </span>
            )}
          </span>

          {filterList && (
            <div className="filter-list">
              <i class="far fa-times-circle search-icon-down" onClick={e => handleSearchFilterClose(e, null)}></i>
              <ul>
                <li>
                  <span
                    className="js-search-direct"
                    onClick={e => {
                      handleSearchFilter(e, 'people');
                    }}
                  >
                    People
                  </span>
                </li>
                <li>
                  <span
                    className="js-search-channel"
                    onClick={e => {
                      handleSearchFilter(e, 'channels');
                    }}
                  >
                    Channels
                  </span>
                </li>
                <li>
                  <span
                    className="js-search-stared"
                    onClick={e => {
                      handleSearchFilter(e, 'starred');
                    }}
                  >
                    Starred
                  </span>
                </li>
                <li>
                  <span
                    className="js-search-muted"
                    onClick={e => {
                      handleSearchFilter(e, 'muted');
                    }}
                  >
                    Muted
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {showInputOverlay && showOnce && <SuggestionOverlay message='Search for any messages' />}
    </div>
  );
};

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getSearchResultsAction,
      clearSearchResultsAction,
      getDirectConversationsAction,
      getChannelConversationsAction,
      clearDirectConversationsAction,
      clearChannelConversationsAction,
      clearStarredConversationsAction,
      clearMutedConversationsAction,
      getStarredConversationsAction,
      getMutedConversationsAction,
      push,
    },
    dispatch,
  );
};


const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InboxSearch));
