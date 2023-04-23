import store from '../../src/client/toolkit-refactor/store';

import {
  reqResReplaced,
} from '../../src/client/toolkit-refactor/reqRes/reqResSlice';

import connectionController from '../../src/client/controllers/reqResController';

jest.mock('../../src/client/toolkit-refactor/store', () => ({
  __esModule: true,
  default: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  appDispatch: jest.fn(),
}));


jest.mock('../../src/client/toolkit-refactor/reqRes/reqResSlice', () => ({
  __esModule: true,
  reqResReplaced: jest.fn(),
}));

describe('connectionController', () => {
  describe('toggleSelectAll', () => {
    it('should toggle the checked state for all objects in the reqResArray', () => {
      // Set up the initial state of the reqResArray
      const initialState = {
        reqRes: {
          reqResArray: [
            { id: 1, checked: false },
            { id: 2, checked: true },
            { id: 3, checked: false },
          ],
        },
      };

      // Mock the Store.getState function to return the initial state
      store.getState.mockReturnValue(initialState);

      // Call the toggleSelectAll function and assert that the checked state has been toggled for all objects in the reqResArray
      connectionController.toggleSelectAll();
      expect(initialState.reqRes.reqResArray[0].checked).toBe(true);
      expect(initialState.reqRes.reqResArray[1].checked).toBe(false);
      expect(initialState.reqRes.reqResArray[2].checked).toBe(true);

      // Assert that the reqResReplaced action was called with the modified reqResArray
      expect(reqResReplaced).toHaveBeenCalledWith(initialState.reqRes.reqResArray);
    });
  });
});