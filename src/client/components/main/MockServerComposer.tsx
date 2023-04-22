// react-redux
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startServer,
  stopServer,
} from '../../../client/toolkit-refactor/mockServer/mockServerSlice';
import { newRequestFieldsByProtocol } from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';

// forms
import RestMethodAndEndpointEntryForm from './new-request/RestMethodAndEndpointEntryForm';
import HeaderEntryForm from './new-request/HeaderEntryForm';
import CookieEntryForm from './new-request/CookieEntryForm';
import BodyEntryForm from './new-request/BodyEntryForm';

// mui
import { Box, Button, Modal, Typography } from '@mui/material';

/**
 * grab context from Electron window
 * note: api is the ipcRenderer object (see preload.js)
 */
const { api } = window as any;

// TODO: add typing to the props object
// TODO: add an option to see the list of existing routes that shows up in the response window
// TODO: add endpoint validation
// TODO: add the ability to mock HTML responses (or remove the HTML option from the BodyEntryForm component)
// TODO: hook up the headers and cookies to the mock endpoint creation

// styling for the mui box modal component
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MockServerComposer = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [userDefinedEndpoint, setUserDefinedEndpoint] = useState('');
  const dispatch = useDispatch();

  // grab the isServerStarted state from the Redux store
  let isServerStarted = useSelector(
    (state: any) => state.mockServer.isServerStarted
  );

  useEffect(() => {
    dispatch(newRequestFieldsByProtocol('mock'));
  }, [dispatch]);

  const startMockServer = () => {
    api.send('start-mock-server');
    console.log('server started');
    dispatch(startServer());
  };

  const stopMockServer = () => {
    api.send('stop-mock-server');
    dispatch(stopServer());
    alert('Mock server stopped');
  };

  // toggles the mock server on and off
  const handleServerButtonClick = () => {
    isServerStarted ? stopMockServer() : startMockServer();
  };

  // triggers when the user clicks the submit button
  const handleEndpointSubmit = async () => {
    // check if the mock server is running
    if (isServerStarted) {
      // check if endpoint starts with a forward slash
      const parsedUserDefinedEndpoint =
        props.newRequestFields.restUrl[0] === '/'
          ? props.newRequestFields.restUrl
          : `/${props.newRequestFields.restUrl}`;

      // grab the method type from the RestMethodAndEndpointEntryForm component
      const methodType = props.newRequestFields.method;

      // check if the body is parsable JSON
      try {
        JSON.parse(props.newRequestBody.bodyContent);
      } catch (err) {
        alert('Please enter a JSON parsable body');
      }

      // parse the response from the BodyEntryForm component because it is a stringified JSON object in props
      const parsedCodeMirrorBodyContent = JSON.parse(
        props.newRequestBody.bodyContent
      );

      // create an object that contains the method, endpoint, and response
      const postData = {
        method: methodType,
        endpoint: parsedUserDefinedEndpoint,
        response: parsedCodeMirrorBodyContent,
      };

      // send a message with the stringified postData to the main_mockServerController to execute the POST request
      api.send('submit-mock-request', JSON.stringify(postData));

      setUserDefinedEndpoint(parsedUserDefinedEndpoint);
      setShowModal(true);
    } else {
      alert('Please start the mock server before submitting an endpoint');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // instructions to pass down to the BodyEntryForm component as a placeholder
  const instructions = `
  How to create a mock endpoint:

  1. Click the start server button
  2. Select a method type from the dropdown menu
  3. Enter an endpoint and a response to mock
  4. Click the submit button 
  `;

  return (
    <Box
      className="add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="mockcomposer-http2"
    >
      <div className="is-flex is-flex-direction-column container-margin">
        <div className="is-flex is-align-items-center">
          <Button
            className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
            id="response"
            variant="contained"
            color="primary"
            onClick={handleServerButtonClick}
            sx={{ mr: 1, textTransform: 'none' }}
          >
            {isServerStarted ? 'Stop Server' : 'Start Server'}
          </Button>
          <div className="is-flex-grow-1">
            <RestMethodAndEndpointEntryForm
              {...props}
              method={props.newRequestFields.method}
              placeholder="/Enter mock endpoint"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <HeaderEntryForm {...props} />
        <CookieEntryForm {...props} />
        <BodyEntryForm
          isMockServer={true}
          placeholder={instructions}
          {...props}
        />
        <div className="is-flex mt-3">
          <Button
            className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
            variant="contained"
            color="primary"
            onClick={handleEndpointSubmit}
            sx={{ ml: 1, textTransform: 'none' }}
          >
            Submit
          </Button>
          <Modal open={showModal} onClose={handleCloseModal}>
            <Box sx={style} className="is-flex is-flex-direction-column">
              <div>
                <Typography variant="h6">
                  Mock endpoint successfully created!
                  <br />
                  <br />
                  To view the response visit:
                  <br />
                  localhost:9990{userDefinedEndpoint}
                </Typography>
              </div>
              <div className="is-flex is-justify-content-flex-end">
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </Box>
  );
};

export default MockServerComposer;

