import React from 'react';
import { isDesktopApp } from 'common/utils';
import { Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';

const ChatTools = props => {
  const preventClick = props.details && props.details.status === null;
  const onClickFiles = preventClick ? null : e => props.onClicked(e, 'file_shared');
  const onClickNotes = preventClick ? null : e => props.onClicked(e, 'notes');
  const onClickBack = preventClick ? null : e => props.onClicked(e, 'goback');
  const style = { cursor: preventClick ? 'none' : 'pointer' };
  return (
    <Col>
      <Row>
        <Col className="chat-tools">
          {isDesktopApp() && props.showBack ? (
            <span onClick={onClickBack} className="dapp-goback">
              <i className="fas fa-chevron-left" />
            </span>
          ) : (
            <span style={style} onClick={onClickFiles}>
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-file-shared">File Shared</Tooltip>}>
                <i className="fas fa-paperclip" />
              </OverlayTrigger>
              <span className="app-none">File Shared</span>
            </span>
          )}
          <div className="chat-tools--actions">
            {isDesktopApp() && props.showBack && (
              <span className="mr-3" style={style} onClick={onClickFiles}>
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-file-shared">File Shared</Tooltip>}>
                  <i className="fas fa-paperclip" />
                </OverlayTrigger>
                <span className="app-none">File Shared</span>
              </span>
            )}

            {!props.notAMember && (
              <span className="mr-3">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>{props.muted ? 'Unmute this' : 'Mute This'}</Tooltip>}
                >
                  <i
                    className={props.muted ? 'far fa-bell-slash' : 'far fa-bell'}
                    onClick={() => {
                      props.onClick();
                    }}
                  />
                </OverlayTrigger>
              </span>
            )}
            <span style={{ paddingRight: '16px', ...style }} onClick={onClickNotes}>
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-todo">Todo</Tooltip>}>
                <i className="far fa-clipboard" />
              </OverlayTrigger>{' '}
              <span className="app-none">Todo</span>
            </span>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default ChatTools;
