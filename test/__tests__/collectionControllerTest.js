import { v4 as uuid } from 'uuid';
import db from '../../src/client/db';
import collectionsController from '../../src/client/controllers/collectionsController';
import { appDispatch } from '../../src/client/toolkit-refactor/store';
import { collectionsReplaced } from '../toolkit-refactor/slices/collectionsSlice';


// jest.mock('../../src/client/db');
// jest.mock('../../src/client/toolkit-refactor/store');

// const mockApi = {
//   send: jest.fn(),
//   receive: jest.fn(),
// };

// const collectionsControllerWithMockApi = {
//   ...collectionsController,
//   api: mockApi,
// };

// xdescribe('collectionsController', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   xdescribe('addCollectionToIndexedDb', () => {
//     it('adds collections to the db', () => {
//       const collectionArr = [
//         { id: '1', name: 'Collection 1', createdAt: new Date() },
//         { id: '2', name: 'Collection 2', createdAt: new Date() },
//       ];

//       db.table.mockReturnValue({
//         put: jest.fn().mockResolvedValue(null),
//       });

//       collectionsController.addCollectionToIndexedDb(collectionArr);

//       expect(db.table).toHaveBeenCalledWith('collections');

//       for (const collection of collectionArr) {
//         expect(db.table().put).toHaveBeenCalledWith(collection);
//       }
//     });
//   });

//   describe('deleteCollectionFromIndexedDb', () => {
//     it('deletes a collection from the db', () => {
//       const id = '1';

//       db.table.mockReturnValue({
//         delete: jest.fn().mockResolvedValue(null),
//       });

//       collectionsController.deleteCollectionFromIndexedDb(id);

//       expect(db.table).toHaveBeenCalledWith('collections');
//       expect(db.table().delete).toHaveBeenCalledWith(id);
//     });
//   });

//   describe('updateCollectionInIndexedDb', () => {
//     it('updates a collection in the db', () => {
//       const collection = {
//         id: '1',
//         name: 'Updated Collection',
//         createdAt: new Date(),
//       };

//       db.table.mockReturnValue({
//         delete: jest.fn().mockResolvedValue(null),
//         put: jest.fn().mockResolvedValue(null),
//       });

//       collectionsController.updateCollectionInIndexedDb(collection);

//       expect(db.table).toHaveBeenCalledWith('collections');
//       expect(db.table().delete).toHaveBeenCalledWith(collection.id);
//       expect(db.table().put).toHaveBeenCalledWith(collection);
//     });
//   });

//   describe('getCollections', () => {
//     it('gets collections from the db and dispatches them to the store', async () => {
//       const collections = [
//         { id: '1', name: 'Collection 1', createdAt: new Date() },
//         { id: '2', name: 'Collection 2', createdAt: new Date() },
//       ];

//       db.table.mockReturnValue({
//         toArray: jest.fn().mockResolvedValue(collections),
//       });

//       const dispatchSpy = jest.spyOn(appDispatch, 'mockReturnValue');
//       collectionsReplaced.mockReturnValue({ type: 'collections/replaced' });

//       await collectionsController.getCollections();

//       expect(db.table).toHaveBeenCalledWith('collections');
//       expect(db.table().toArray).toHaveBeenCalled();

//       collections.forEach((collection) => {
//         expect(collection.createdAt).toBeInstanceOf(Date);
//       });

//       expect(dispatchSpy).toHaveBeenCalledWith(
//         collectionsReplaced(collections)
//       );
//     });
//   });

//   describe('collectionNameExists', () => {
//     it('returns true if a collection with the given name exists in the db', async () => {
//       const name = 'Collection 1';

//       db.table.mockReturnValue({
//         where: jest.fn().mockReturnThis(),
//         equalsIgnoreCase: jest.fn().mockReturnThis(),
//         first: jest.fn().mockResolvedValue({}),
//       });

//       const result = await collectionsController.collectionNameExists(name);

//       expect(db.table).toHaveBeenCalledWith('collections');
//       expect(db.table().where().equalsIgnoreCase).toHaveBeenCalledWith('name');
//       expect(db.table().where().equalsIgnoreCase().first).toHaveBeenCalled();
//       expect(result).toBe(true);
//     });

//     it('returns false if a collection with the given name does not exist in the db', async () => {
//       const name = 'Collection 3';

//       db.table.mockReturnValue({
//         where: jest.fn().mockReturnThis(),
//         equalsIgnoreCase: jest.fn().mockReturnThis(),
//         first: jest.fn().mockResolvedValue(undefined),
//       });

//       const result = await collectionsController.collectionNameExists(name);

//       expect(db.table).toHaveBeenCalledWith('collections');
//       expect(db.table().where).toHaveBeenCalledWith('name');
//       expect(db.table().where().equalsIgnoreCase).toHaveBeenCalledWith(name);
//       expect(db.table().where().equalsIgnoreCase().first).toHaveBeenCalled();
//       expect(result).toBe(false);
//     });
//   });

//   describe('exportToFile', () => {
//     it('exports a collection to a file', () => {
//       const id = '1';
//       const collection = {
//         id: '1',
//         name: 'Collection 1',
//         createdAt: new Date(),
//       };

//       db.table.mockReturnValue({
//         where: jest.fn().mockReturnThis(),
//         equals: jest.fn().mockReturnThis(),
//         first: jest.fn().mockImplementation((callback) => callback(collection)),
//       });

//       api.send = jest.fn();
//       uuid.mockReturnValue('new-id');

//       collectionsController.exportToFile(id);

//       expect(db.table).toHaveBeenCalledWith('collections');
//       expect(db.table().where).toHaveBeenCalledWith('id');
//       expect(db.table().where().equals).toHaveBeenCalledWith(id);
//       expect(db.table().where().equals().first).toHaveBeenCalled();

//       expect(uuid).toHaveBeenCalled();

//       expect(api.send).toHaveBeenCalledWith('export-collection', {
//         collection: {
//           ...collection,
//           name: 'Collection 1 export',
//           id: 'new-id',
//         },
//       });
//     });
//   });

//   describe('importCollection', () => {
//     it('imports a collection and adds it to the db and dispatches to the store', async () => {
//       const collection = {
//         id: '1',
//         name: 'Collection 1',
//         createdAt: new Date(),
//       };

//       api.send = jest.fn();
//       api.receive = jest.fn().mockImplementation((eventName, callback) => {
//         if (eventName === 'add-collections') {
//           callback([collection]);
//         }
//       });

//       const dispatchSpy = jest.spyOn(appDispatch, 'mockReturnValue');
//       collectionsReplaced.mockReturnValue({ type: 'collections/replaced' });

//       const result = await collectionsController.importCollection(collection);

//       expect(api.send).toHaveBeenCalledWith('import-collection', collection);

//       expect(api.receive).toHaveBeenCalledWith('add-collections', expect.any(Function));

//       expect(dispatchSpy).toHaveBeenCalledWith(collectionsReplaced([collection]));

//       expect(result).toBe('okie dokie');
//     });
//   });
// });

describe('collectionsController', () => {
  let collectionsControllerWithMockApi;

  // beforeEach(() => {
  //   jest.clearAllMocks();

  //   const mockApi = {
  //     send: jest.fn(),
  //     receive: jest.fn(),
  //   };

  //   collectionsControllerWithMockApi = {
  //     ...collectionsController,
  //     api: mockApi,
  //   };
  // });

  // describe('exportToFile', () => {
  //   it('exports a collection to a file', () => {
  //     const id = '1';
  //     const collection = {
  //       id: '1',
  //       name: 'Collection 1',
  //       createdAt: new Date(),
  //     };

  //     db.table.mockReturnValue({
  //       where: jest.fn().mockReturnThis(),
  //       equals: jest.fn().mockReturnThis(),
  //       first: jest.fn().mockImplementation((callback) => callback(collection)),
  //     });

  //     uuid.mockReturnValue('new-id');

  //     collectionsControllerWithMockApi.exportToFile(id);

  //     expect(db.table).toHaveBeenCalledWith('collections');
  //     expect(db.table().where).toHaveBeenCalledWith('id');
  //     expect(db.table().where().equals).toHaveBeenCalledWith(id);
  //     expect(db.table().where().equals().first).toHaveBeenCalled();

  //     expect(uuid).toHaveBeenCalled();

  //     expect(collectionsControllerWithMockApi.api.send).toHaveBeenCalledWith('export-collection', {
  //       collection: {
  //         ...collection,
  //         name: 'Collection 1 export',
  //         id: 'new-id',
  //       },
  //     });
  //   });
  // });

  // describe('importCollection', () => {
  //   it('imports a collection and adds it to the db and dispatches to the store', async () => {
  //     const collection = {
  //       id: '1',
  //       name: 'Collection 1',
  //       createdAt: new Date(),
  //     };

  //     collectionsReplaced.mockReturnValue({ type: 'collections/replaced' });

  //     const result = await collectionsControllerWithMockApi.importCollection(collection);

  //     expect(collectionsControllerWithMockApi.api.send).toHaveBeenCalledWith('import-collection', collection);

  //     expect(collectionsControllerWithMockApi.api.receive).toHaveBeenCalledWith('add-collections', expect.any(Function));

  //     expect(appDispatch).toHaveBeenCalledWith(collectionsReplaced([collection]));

  //     expect(result).toBe('okie dokie');
  //   });
  // });
});