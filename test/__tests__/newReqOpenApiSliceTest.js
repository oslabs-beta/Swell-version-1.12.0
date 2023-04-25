import newRequestOpenApiReducer, { newServerAdded } from '../../src/client/toolkit-refactor/slices/newRequestOpenApiSlice';

describe('newRequestOpenApiSlice', () => {
  describe('newServerAdded', () => {
    it('adds the new server to the appropriate request', () => {
      const initialState = {
        openApiMetadata: {
          info: {},
          tags: [],
          serverUrls: ['https://example.com', 'https://example.org'],
        },
        openApiReqArray: [
          {
            request: {
              id: 1,
            },
            headers: [],
            urls: ['https://example.com/test'],
            endpoint: '/test',
            reqServers: ['https://example.com'],
            serverIds: [0],
            cookies: '',
            method: 'get',
            body: '',
            mediaType: '',
            rawType: '',
          },
        ],
      };

      const newServer = {
        request: {
          id: 1,
        },
        headers: [],
        urls: [],
        endpoint: '/test',
        reqServers: [],
        serverIds: [1],
        cookies: '',
        method: 'get',
        body: '',
        mediaType: '',
        rawType: '',
      };

      const action = newServerAdded(newServer);
      const state = newRequestOpenApiReducer(initialState, action);

      expect(state.openApiReqArray).toHaveLength(2);
      expect(state.openApiReqArray[0].reqServers).toContain('https://example.org');
    });
  });

  xdescribe('serversRemovedByIndex'), () => {
    it('deletes a server given the appropriate request', () => {
        // const initialState = {
        //   openApiMetadata: {
        //     info: {},
        //     tags: [],
        //     serverUrls: ['https://example.com', 'https://example.org'],
        //   },
        //   openApiReqArray: [
        //     {
        //       request: {
        //         id: 1,
        //       },
        //       headers: [],
        //       urls: ['https://example.com/test'],
        //       endpoint: '/test',
        //       reqServers: ['https://example.com'],
        //       serverIds: [0],
        //       cookies: '',
        //       method: 'get',
        //       body: '',
        //       mediaType: '',
        //       rawType: '',
        //     },
        //   ],
        // };
  
        // const newServer = {
        //   request: {
        //     id: 1,
        //   },
        //   headers: [],
        //   urls: [],
        //   endpoint: '/test',
        //   reqServers: [],
        //   serverIds: [1],
        //   cookies: '',
        //   method: 'get',
        //   body: '',
        //   mediaType: '',
        //   rawType: '',
        // };
  
        const action =serversRemovedByIndex(newServer);
        const state = newRequestOpenApiReducer(initialState, action);
  
        // expect(state.openApiReqArray).toHaveLength(2);
        // expect(state.openApiReqArray[0].reqServers[0]).toContain('https://example.org');
      });
  }

});