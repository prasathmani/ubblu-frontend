import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  ButtonToolbar,
  Table,
  Form,
} from 'react-bootstrap';

import './index.scss';

class Files extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className="my-files">
          <Row>
            <Col className="justify-content-md-center row" sm="12">
              <div className="custom-btn-switch mt-3 mb-3">
                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="options" defaultValue={2}>
                    <ToggleButton variant="light" value={1}>
                      Person
                    </ToggleButton>
                    <ToggleButton variant="light" value={2}>
                      Channel
                    </ToggleButton>
                    <ToggleButton variant="light" value={3}>
                      My Files (Shared)
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
              </div>
            </Col>
            <Col />
          </Row>
          <Row>
            <Col sm="12" as={Row} className="mb-3">
              <Col sm="6">
                <h5 className="mt-2">Files</h5>
              </Col>
              <Col sm="6">
                <div className="my-files__toolbar float-right">
                  <Button>
                    <i className="fas fa-cloud-upload-alt" />
                  </Button>
                  <Button>
                    <i className="far fa-trash-alt" />
                  </Button>
                  <div className="searchbar">
                    <input className="search_input" type="text" name="" placeholder="Search..." />
                    <a href="#/search" className="search_icon">
                      <i className="fas fa-search" />
                    </a>
                  </div>
                </div>
              </Col>
            </Col>
            <Col sm="12">
              <Table responsive hover variant="light">
                <thead>
                  <tr className="br-top-2">
                    <th>
                      <Form.Check custom id="select-user-all" type="checkbox" label="" />
                    </th>
                    <th>File Name</th>
                    <th>Channel Name</th>
                    <th>Download Link</th>
                    <th>File Owner</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Check custom id="select-user-121" type="checkbox" label="" />
                    </td>
                    <td>latest-uploaded-file.pdf</td>
                    <td>
                      <a href="#/channel/97894">Skywalk</a>
                    </td>
                    <td>
                      <a href="https://cdn.ubblu.ga/easu427rsw3" target="_blank" rel="noopener noreferrer">
                        http://cdn.ubblu.ga/qjuilos76
                      </a>
                      <span className="my-files__inline--actions">
                        <i className="far fa-arrow-alt-circle-down" title="Download" />
                        <i className="fas fa-share-alt" title="Share" />
                      </span>
                    </td>
                    <td>
                      <a href="/users/874093285093725">Mottovo Bursy</a>
                    </td>
                    <td>04-07-2019</td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        Go
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check custom id="select-user-121" type="checkbox" label="" />
                    </td>
                    <td>e-car.pdf</td>
                    <td>
                      <a href="#/channel/97894">Automobile</a>
                    </td>
                    <td>
                      <a href="https://cdn.ubblu.ga/e87kdfytw3" target="_blank" rel="noopener noreferrer">
                        http://cdn.ubblu.ga/0mtjuf75
                      </a>
                      <span className="my-files__inline--actions">
                        <i className="far fa-arrow-alt-circle-down" title="Download" />
                        <i className="fas fa-share-alt" title="Share" />
                      </span>
                    </td>
                    <td>
                      <a href="/users/874093285093725">Mottovo Bursy</a>
                    </td>
                    <td>21-08-2019</td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        Go
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check custom id="select-user-121" type="checkbox" label="" />
                    </td>
                    <td>May-17-1Nine.pdf</td>
                    <td>
                      <a href="#/channel/97894">Monthly Report</a>
                    </td>
                    <td>
                      <a href="https://cdn.ubblu.ga/easu4dgd" target="_blank" rel="noopener noreferrer">
                        http://cdn.ubblu.ga/lo7rg8m4
                      </a>
                      <span className="my-files__inline--actions">
                        <i className="far fa-arrow-alt-circle-down" title="Download" />
                        <i className="fas fa-share-alt" title="Share" />
                      </span>
                    </td>
                    <td>
                      <a href="/users/874093285093725">Ethan Hunt</a>
                    </td>
                    <td>12-04-2019</td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        Go
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Files;
