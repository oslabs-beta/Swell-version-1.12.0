import newRequestReducer, 
{ initialState, 
    newRequestHeadersSet,
    newRequestContentByProtocol } from '../../src/client/toolkit-refactor/slices/newRequestSlice';


describe('newRequestSlice', () => {
  it('should set new request headers', () => {
    const headers = { headersArr: [{ key: 'Content-Type', value: 'application/json' }], count: 1 };
    const action = newRequestHeadersSet(headers);
    const newState = newRequestReducer(initialState, action);

    expect(newState.newRequestHeaders).toEqual(headers);
  });
  
  describe('newRequestContentByProtocol', () => {
    it('should return initial state for unknown protocol', () => {
      const initialState = {
        newRequestHeaders: {
          headersArr: [],
          count: 0,
        },
        newRequestBody: {
          bodyContent: '',
          bodyVariables: '',
          bodyType: 'raw',
          rawType: 'text/plain',
          JSONFormatted: true,
          bodyIsNew: false,
        },
        newRequestStreams: {
          streamsArr: [],
          count: 0,
          streamContent: [],
          selectedPackage: null,
          selectedRequest: null,
          selectedService: null,
          selectedServiceObj: null,
          selectedStreamingType: null,
          initialQuery: null,
          queryArr: null,
          protoPath: null,
          services: null,
          protoContent: '',
        },
        newRequestCookies: {
          cookiesArr: [],
          count: 0,
        },
        newRequestSSE: {
          isSSE: false,
        },
      };
      const result = newRequestReducer(initialState, newRequestContentByProtocol('unknown'));
      expect(result).toEqual(initialState);
    });
  
    it('should compose a new request store for a known protocol', () => {
      const initialState = {
        newRequestHeaders: {
          headersArr: [],
          count: 0,
        },
        newRequestBody: {
          bodyContent: '',
          bodyVariables: '',
          bodyType: 'raw',
          rawType: 'text/plain',
          JSONFormatted: true,
          bodyIsNew: false,
        },
        newRequestStreams: {
          streamsArr: [],
          count: 0,
          streamContent: [],
          selectedPackage: null,
          selectedRequest: null,
          selectedService: null,
          selectedServiceObj: null,
          selectedStreamingType: null,
          initialQuery: null,
          queryArr: null,
          protoPath: null,
          services: null,
          protoContent: '',
        },
        newRequestCookies: {
          cookiesArr: [],
          count: 0,
        },
        newRequestSSE: {
          isSSE: false,
        },
      };
      const expected = {
        ...initialState,
        newRequestBody: {
          ...initialState.newRequestBody,
          bodyType: 'TRPC',
          bodyVariables: '',
        },
      };
      const result = newRequestReducer(initialState, newRequestContentByProtocol('tRPC'));
      expect(result).toEqual(expected);
    });
  });

});