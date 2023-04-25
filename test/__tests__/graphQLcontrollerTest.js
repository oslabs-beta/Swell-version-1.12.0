import graphQLController from '../../src/client/controllers/graphQLController.ts';

describe('graphQLController', () => {
  describe('cookieFormatter', () => {
    it('should format cookie array', () => {
      const cookieArray = [
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie1',
          path: '/',
          secure: false,
          session: false,
          value: 'value1',
        },
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie2',
          path: '/',
          secure: false,
          session: false,
          value: 'value2',
        },
      ];
      const expectedOutput = [
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie1',
          path: '/',
          secure: false,
          session: false,
          value: 'value1',
        },
        {
          domain: 'localhost',
          expires: '2024-06-12T18:19:03.262Z',
          hostOnly: true,
          httpOnly: false,
          name: 'cookie2',
          path: '/',
          secure: false,
          session: false,
          value: 'value2',
        },
      ];
      expect(graphQLController.cookieFormatter(cookieArray)).toEqual(expectedOutput);
    });
  });
  
  describe('introspect', () => {
    const url = 'http://localhost:4000/graphql';
    const headers = [
      { key: 'authorization', value: 'Bearer token' },
      { key: 'content-type', value: 'application/json' },
    ];
    const cookies = [{ key: 'cookie1', value: 'value1' }, { key: 'cookie2', value: 'value2' }];
    
        it('should send introspection query and dispatch introspectionDataChanged action', () => {
        const data = { data: 'introspection data' };

        const expectedOutput = { schemaSDL: 'schema sdl', clientSchema: 'client schema' };
        jest.spyOn(graphQLController, 'buildClientSchema').mockReturnValueOnce('client schema');
        jest.spyOn(graphQLController, 'printSchema').mockReturnValueOnce('schema sdl');
        jest.spyOn(graphQLController, 'introspectionDataChanged').mockReturnValueOnce('introspectionDataChanged action');
        jest.spyOn(api, 'receive').mockImplementationOnce((eventName, callback) => callback(data));
        
        graphQLController.introspect(url, headers, cookies);
        
        expect(api.send).toHaveBeenCalledWith('introspect', JSON.stringify({ url, headers, cookies }));
        expect(graphQLController.buildClientSchema).toHaveBeenCalledWith(data);
        expect(graphQLController.printSchema).toHaveBeenCalledWith('client schema');
        expect(graphQLController.introspectionDataChanged).toHaveBeenCalledWith(expectedOutput);
        expect(appDispatch).toHaveBeenCalledWith('introspectionDataChanged action');
        });
    });

    // Test cases for openGraphQLConnection
  describe('openGraphQLConnection', () => {
    const reqResObj = { /* create a ReqRes object */ };
  
    it('should initialize response data correctly', async () => {
      await graphQLController.openGraphQLConnection(reqResObj);
  
      expect(reqResObj.response.headers).toEqual({});
      expect(reqResObj.response.events).toEqual([]);
      expect(reqResObj.response.cookies).toEqual([]);
      expect(reqResObj.connection).toEqual('open');
      expect(reqResObj.timeSent).toBeGreaterThan(0);
    });
  
    it('should call sendGqlToMain', async () => {
      const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain');
      await graphQLController.openGraphQLConnection(reqResObj);
      expect(sendGqlToMainSpy).toHaveBeenCalledWith({ reqResObj });
    });
  
    it('should handle response correctly', async () => {
      const response = { /* create a GraphQLResponse object */ };
      const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain').mockResolvedValue({ data: response, reqResObj });
      const handleResponseSpy = jest.spyOn(graphQLController, 'handleResponse');
  
      await graphQLController.openGraphQLConnection(reqResObj);
  
      expect(handleResponseSpy).toHaveBeenCalledWith(response, reqResObj);
    });
  
    it('should handle error correctly', async () => {
      const error = 'Error message';
      const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain').mockResolvedValue({ error, reqResObj });
      const handleErrorSpy = jest.spyOn(graphQLController, 'handleError');
  
      await graphQLController.openGraphQLConnection(reqResObj);
  
      expect(handleErrorSpy).toHaveBeenCalledWith(error, reqResObj);
    });
  });

  // Test cases for openGraphQLConnectionAndRunCollection
  describe('openGraphQLConnectionAndRunCollection', () => {
    const reqResArray = [/* create an array of ReqRes objects */];
  
    it('should call runSingleGraphQLRequest with the first object in the array', async () => {
      const runSingleGraphQLRequestSpy = jest.spyOn(graphQLController, 'runSingleGraphQLRequest');
      await graphQLController.openGraphQLConnectionAndRunCollection(reqResArray);
      expect(runSingleGraphQLRequestSpy).toHaveBeenCalledWith(reqResArray[0]);
    });
  
    it('should call runSingleGraphQLRequest with the next object in the array after the first object has received a response', async () => {
      const response = { /* create a GraphQLResponse object */ };
      const sendGqlToMainSpy = jest.spyOn(graphQLController, 'sendGqlToMain')
        .mockResolvedValue({ data: response, reqResObj: reqResArray[0] });

      const runSingleGraphQLRequestSpy = jest.spyOn(graphQLController, 'runSingleGraphQLRequest');
      
      await graphQLController.openGraphQLConnectionAndRunCollection(reqResArray);
  
      expect(runSingleGraphQLRequestSpy).toHaveBeenCalledWith(reqResArray[1]);
    });
  });

})
