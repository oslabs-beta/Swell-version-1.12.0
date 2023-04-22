
import Store from '../../src/client/toolkit-refactor/store';
import { appDispatch } from '../../src/client/toolkit-refactor/store';
import { reqResReplaced } from '../../src/client/toolkit-refactor/reqRes/reqResSlice';
import connectionController from '../../src/client/controllers/collectionsController';

import reqResController from '../../src/client/controllers/resResController.ts';

import { reqResUpdated, responseDataSaved } from '../../src/client/toolkit-refactor/reqRes/reqResSlice';
import { ReqRes } from '../../src/types';
import '../__mocks__/windowMock.js';

// toggleSelectAll:
// Test that when all reqResArray objects are unchecked, calling toggleSelectAll should check all objects.
// Test that when all reqResArray objects are checked, calling toggleSelectAll should uncheck all objects.
// Test that calling toggleSelectAll with a mix of checked and unchecked objects should toggle the check state for all objects.
describe('connectionController', () => {
    describe('toggleSelectAll', () => {
      it('should toggle the checked property of all request-response objects in the state', () => {
        // Mock request-response array with two objects, both with checked: false
        const reqResArray = [
          { id: 1, checked: false },
          { id: 2, checked: false },
        ];
        Store.getState().reqRes.reqResArray = reqResArray;
  
        connectionController.toggleSelectAll();
  
        // Check that checked property of all objects in the array has been toggled to true
        expect(reqResArray.every((obj) => obj.checked === true)).toBe(true);
  
        connectionController.toggleSelectAll();
  
        // Check that checked property of all objects in the array has been toggled back to false
        expect(reqResArray.every((obj) => obj.checked === false)).toBe(true);
  
        // Check that the updated request-response array is dispatched to the Redux store
        expect(appDispatch).toHaveBeenCalledWith(reqResReplaced(reqResArray));
      });
    });
  });

// openReqRes:
// Test that calling openReqRes with a valid ID should open a connection.
// Test that calling openReqRes with an invalid ID should do nothing.
// Test that calling openReqRes with a subscription request should call graphQLController.openSubscription.
// Test that calling openReqRes with a GraphQL request should call graphQLController.openGraphQLConnection.
// Test that calling openReqRes with a WebSocket request should call api.send('open-ws', reqResObj, this.openConnectionArray).
// Test that calling openReqRes with a gRPC request should call api.send('open-grpc', reqResObj).
// Test that calling openReqRes with a non-special request should call api.send('open-http', reqResObj).
describe('connectionController openReqRes', () => {
  let storeMock;
  let apiMock;

  beforeAll(() => {
    storeMock = {
      getState: jest.fn(),
    };

    apiMock = {
      receive: jest.fn(),
      removeAllListeners: jest.fn(),
      send: jest.fn(),
    };

    // Set up window mock
    Object.defineProperty(global, 'window', {
      value: {
        api: apiMock,
      },
    });
  });

  afterAll(() => {
    // Restore window mock
    Object.defineProperty(global, 'window', {
      value: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call api.receive with the correct arguments', () => {
    const connectionController = require('../connectionController').default;
    const reqResObj = {
      id: 'testID',
      request: {
        method: 'GET',
        headers: [],
        cookies: [],
        body: '',
        bodyType: 'raw',
        bodyVariables: '',
        rawType: 'text/plain',
        isSSE: false,
        network: 'rest',
        restUrl: 'http://jsonplaceholder.typicode.com/posts',
        wsUrl: 'ws://',
        gqlUrl: 'https://',
        grpcUrl: '',
      },
      graphQL: false,
      gRPC: false,
      protocol: 'http://',
    };

    // Mock the getState method to return an empty reqResArray
    storeMock.getState.mockReturnValue({ reqRes: { reqResArray: [] } });

    // Call openReqRes with the reqResObj
    connectionController.openReqRes(reqResObj.id);

    // Expect api.removeAllListeners to have been called with 'reqResUpdate'
    expect(apiMock.removeAllListeners).toHaveBeenCalledWith('reqResUpdate');

    // Expect api.receive to have been called with 'reqResUpdate' and a callback function
    expect(apiMock.receive).toHaveBeenCalledWith('reqResUpdate', expect.any(Function));
  });
});

// runCollectionTest:
// Test that calling runCollectionTest with an empty array should do nothing.
// Test that calling runCollectionTest with an array of requests should run each request in sequence.
// Test that calling runCollectionTest with a subscription request should call graphQLController.openSubscription.
// Test that calling runCollectionTest with a GraphQL request should call graphQLController.openGraphQLConnectionAndRunCollection.
// Test that calling runCollectionTest with a WebSocket request should call api.send('open-ws', reqResObj).
// Test that calling runCollectionTest with a gRPC request should call api.send('open-grpc', reqResObj).
// Test that calling runCollectionTest with a non-special request should call api.send('open-http', reqResObj).

// This test sets up a mock window.api object and passes an array of two reqRes objects to 
// runCollectionTest. It then simulates two reqResUpdate events and checks that the correct 
// dispatch functions are called and API calls are made. This test ensures that 
// runCollectionTest correctly handles the reqRes objects in the collection and dispatches 
// the correct actions in response to reqResUpdate events.

describe('runCollectionTest', () => {
    beforeEach(() => {
      // Mock the API object
      window.api = {
        send: jest.fn(),
        receive: jest.fn(),
        removeAllListeners: jest.fn(),
      };
    });
  
    afterEach(() => {
      // Reset the mock functions
      jest.resetAllMocks();
    });
  
    it('should run all the tests in a collection', () => {
      // Define the reqResArray to be passed to runCollectionTest
      const reqResArray = [
        {
          id: '1',
          request: {
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/todos/1',
          },
          response: {},
        },
        {
          id: '2',
          request: {
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/posts',
            body: {
              title: 'foo',
              body: 'bar',
              userId: 1,
            },
          },
          response: {},
        },
      ];
  
      // Mock the dispatch function
      const dispatch = jest.fn();
  
      // Mock the Store object
      const store = {
        getState: () => ({ reqRes: { reqResArray } }),
      };
  
      // Call the runCollectionTest function
      connectionController.runCollectionTest(reqResArray);
  
      // Check that the correct API calls were made
      expect(window.api.removeAllListeners).toHaveBeenCalledWith('reqResUpdate');
      expect(window.api.receive).toHaveBeenCalledWith('reqResUpdate', expect.any(Function));
      expect(window.api.send).toHaveBeenCalledWith('open-http', reqResArray[0], connectionController.openConnectionArray);
  
      // Simulate a reqResUpdate event
      const reqResObj = { id: '1', connection: 'closed', timeSent: 123, timeReceived: 456, response: { events: ['event1', 'event2'] } };
      window.api.receive.mock.calls[0][1](reqResObj);
  
      // Check that the correct dispatch functions were called
      expect(dispatch).toHaveBeenCalledWith(reqResUpdated(reqResObj));
      expect(dispatch).toHaveBeenCalledWith(responseDataSaved(reqResObj));
      expect(dispatch).toHaveBeenCalledWith(graphUpdated(reqResObj));
  
      // Check that the correct API calls were made
      expect(window.api.send).toHaveBeenCalledWith('open-http', reqResArray[1], connectionController.openConnectionArray);
  
      // Simulate another reqResUpdate event
      const reqResObj2 = { id: '2', connection: 'closed', timeSent: 789, timeReceived: 101112, response: { events: ['event3', 'event4'] } };
      window.api.receive.mock.calls[0][1](reqResObj2);
  
      // Check that the correct dispatch functions were called
      expect(dispatch).toHaveBeenCalledWith(reqResUpdated(reqResObj2));
      expect(dispatch).toHaveBeenCalledWith(responseDataSaved(reqResObj2));
      expect(dispatch).toHaveBeenCalledWith(graphUpdated(reqResObj2));
    });
  });

// openAllSelectedReqRes:
// Test that calling openAllSelectedReqRes with all objects unchecked should do nothing.
// Test that calling openAllSelectedReqRes with all objects checked should open a connection for each object.
describe('openAllSelectedReqRes', () => {
    it('should call openReqRes for each selected reqRes object', () => {
      const openReqResMock = jest.fn();
      const getStateMock = jest.fn(() => ({
        reqRes: {
          reqResArray: [
            { id: '1', checked: true },
            { id: '2', checked: false },
            { id: '3', checked: true },
          ]
        }
      }));
      const dispatchMock = jest.fn();
  
      Store.getState = getStateMock;
      appDispatch = dispatchMock;
  
      connectionController.openReqRes = openReqResMock;
  
      connectionController.openAllSelectedReqRes();
  
      expect(openReqResMock).toHaveBeenCalledTimes(2);
      expect(openReqResMock).toHaveBeenCalledWith('1');
      expect(openReqResMock).toHaveBeenCalledWith('3');
  
      expect(dispatchMock).toHaveBeenCalledTimes(0);
    });
  });

// setReqResConnectionToClosed:
// Test that calling setReqResConnectionToClosed with a valid ID should set the connection status of the request to 'closed'.
// Test that calling setReqResConnectionToClosed with an invalid ID should do nothing.

describe('setReqResConnectionToClosed', () => {
    const mockDispatch = jest.fn();
    const initialState = {
      reqRes: {
        reqResArray: [
          {
            id: '1',
            connection: 'open',
          },
          {
            id: '2',
            connection: 'open',
          },
        ],
      },
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
      Store.getState = jest.fn(() => initialState);
      appDispatch.mockClear();
    });
  
    it('should set the connection property to closed for the specified ReqRes object', () => {
      const id = '1';
      connectionController.setReqResConnectionToClosed(id);
  
      expect(appDispatch).toHaveBeenCalledWith(
        reqResUpdated({
          id: '1',
          connection: 'closed',
        })
      );
    });
  });

// closeReqRes:
// Test that calling closeReqRes with a subscription request should call graphQLController.closeSubscription.
// Test that calling closeReqRes with a HTTP request should call api.send('close-http', reqResObj).
// Test that calling closeReqRes with a WebSocket request should call api.send('close-ws').
// closeAllReqRes:
// Test that calling closeAllReqRes should close all open connections.
// clearAllReqRes:
// Test that calling clearAllReqRes should close all open connections and clear the request/response array.
// toggleMinimizeAll:
// Test that when all reqResArray objects are minimized, calling toggleMinimizeAll should unmin


// This test checks that the closeReqRes function properly sets a reqRes object's 
// connection to "closed" when the function is called. Note that in order to run 
// this test, you'll need to have the appropriate imports and setup for the Store 
// and reqResUpdated and responseDataSaved actions.

describe('closeReqRes', () => {
    it('should close an HTTP reqRes object', () => {
      // create a sample HTTP reqRes object
      const reqResObj = {
        id: 'testID',
        request: {
          method: 'GET',
          headers: [],
          cookies: [],
          body: '',
          bodyType: 'raw',
          bodyVariables: '',
          rawType: 'text/plain',
          isSSE: false,
          network: 'rest',
          restUrl: 'http://jsonplaceholder.typicode.com/posts',
          wsUrl: 'ws://',
          gqlUrl: 'https://',
          grpcUrl: '',
        },
        response: {
          headers: null,
          events: null,
        },
        connection: 'open',
        connectionType: 'http',
        checked: false,
        minimized: false,
        protocol: 'http://',
        host: 'http://jsonplaceholder.typicode.com',
        path: '/posts',
        url: 'http://jsonplaceholder.typicode.com/posts',
        graphQL: false,
        gRPC: false,
        timeSent: null,
        timeReceived: null,
        tab: 'First Tab',
        checkSelected: false,
        minimizedRequest: false,
        minimizedResponse: false,
      };
  
      // add the sample reqRes object to the state
      Store.dispatch(reqResUpdated(reqResObj));
      // set the current response to the sample reqRes object
      Store.dispatch(responseDataSaved(reqResObj));
  
      // close the sample reqRes object
      connectionController.closeReqRes(reqResObj);
  
      // verify that the reqRes object's connection has been set to "closed"
      expect(Store.getState().reqRes.reqResArray[0].connection).toEqual('closed');
    });
  });