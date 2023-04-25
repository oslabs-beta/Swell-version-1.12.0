/**
* WIP testing:
* initialState is a 'IntrospectionData' type with 2 properties: 1) schemaSDL (string) and 2) clientSchema (GraphQL).
* Might need to try defining these properties in initialState first to do actual testing.
* May need to research into the GraphQL type for the clientSchema property to properly write syntax.
* @todo Complete this slice testing
**/

import IntrospectionDataReducer, { initialState, introspectionDataChanged } from '../../src/client/toolkit-refactor/slices/introspectionDataSlice';

describe('introspectionDataSlice', () => {
    it('state should be updated via new information received', () => {
        const action = introspectionDataChanged();
        const sliceInitialState = IntrospectionDataReducer(initialState, action);
        expect(1).toBe(1);
    });
});