import store, { appDispatch } from '../../src/client/toolkit-refactor/store';
import { responseDataSaved, reqResUpdated } from '../../src/client/toolkit-refactor/reqRes/reqResSlice';
// import { ReqRes } from '../../types';
import { LoadTestController } from '../../src/client/controllers/LoadTestController';
// import { LoadTestResult } from '../components/main/new-request/stressTest/LoadTest';
import { graphUpdated } from '../../src/client/toolkit-refactor/slices/graphPointsSlice';

// mock the store
jest.mock('../../src/client/toolkit-refactor/store');


describe('LoadTestController', () => {
  // make sure to clear the mock before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processLoadTestResults', () => {
    it('updates the corresponding request-response object and dispatches the necessary actions to update the store and associated UI components', () => {
      // hardcode a resReqArray
      const reqResArray = [
        {
          id: '1',
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          method: 'GET',
          headers: [],
          requestBody: '',
          authentication: null,
          response: {
            status: 200,
            statusText: 'OK',
            headers: [],
            body: '',
            events: [],
          },
          connection: 'closed',
          timeSent: new Date(),
          timeReceived: new Date(),
          totalTime: 1000,
        },
      ];
      // hardCode a result object
      const results = {
        label: 'test label',
        errorCount: 0,
        errorRate: 0,
        requestsPerSecond: 10,
        latencyAverage: 50,
        latencyMedian: 50,
        latency95thPercentile: 60,
        latency99thPercentile: 70,
      };

      
      store.getState.mockReturnValue({
        reqRes: { reqResArray },
      });
      appDispatch.mockReturnValue({ type: 'test action' });

      LoadTestController.processLoadTestResults('1', results);

      expect(store.getState).toHaveBeenCalled();
      expect(appDispatch).toHaveBeenCalledTimes(3);
      expect(appDispatch).toHaveBeenCalledWith(graphUpdated({
        ...reqResArray[0],
        response: {
          ...reqResArray[0].response,
          events: results,
        },
      }));
      expect(appDispatch).toHaveBeenCalledWith(reqResUpdated({
        ...reqResArray[0],
        response: {
          ...reqResArray[0].response,
          events: results,
        },
      }));
      expect(appDispatch).toHaveBeenCalledWith(responseDataSaved({
        ...reqResArray[0],
        response: {
          ...reqResArray[0].response,
          events: results,
        },
      }));
    });
  });
});