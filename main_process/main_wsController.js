/* eslint-disable camelcase */
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const WebSocketClient = require('websocket').client;
const fs = require('fs');
const testingController = require('./main_testingController');

const wsController = {
  wsConnect: null,
  openWSconnection(event, reqResObj, connectionArray) {
    // set reqResObj for WS
    reqResObj.response.messages = [];
    reqResObj.request.messages = [];
    reqResObj.connection = 'pending';
    reqResObj.closeCode = 0;
    reqResObj.timeSent = Date.now();

    // update frontend its pending
    event.sender.send('reqResUpdate', reqResObj);

    // create socket
    // check websocket npm package doc
    let socket;
    try {
      socket = new WebSocketClient();
    } catch (err) {
      reqResObj.connection = 'error';
      event.sender.send('reqResUpdate', reqResObj);
      return;
    }

    // when it connects, update connectionArray
    // connection here means a single connection being established
    socket.on('connect', (connection) => {
      console.log('websocket client connected');
      this.wsConnect = connection;
      reqResObj.connection = 'open';
      reqResObj.response.connection = 'open';

      const openConnectionObj = {
        connection,
        protocol: 'WS',
        id: reqResObj.id,
      };
      connectionArray.push(openConnectionObj);
      event.sender.send('update-connectionArray', connectionArray);
      event.sender.send('reqResUpdate', reqResObj);

      // connection.on
      this.wsConnect.on('close', () => {
        console.log('closed WS');
      });
    });

    // listener for failed socket connection,
    socket.on('connectFailed', (error) => {
      console.log(`WS Connect Error: ${error.toString()}`);
      reqResObj.connection = 'error';
      reqResObj.error = error;
      reqResObj.response.events.push(error);
      reqResObj.timeReceived = Date.now();
      event.sender.send('reqResUpdate', reqResObj);
    });

    // connect socket
    socket.connect(reqResObj.url);
  },

  // close connection
  closeWs(event) {
    this.wsConnect.close();
  },

  sendWebSocketMessage(event, reqResObj, inputMessage) {
    // check datatype
    if (inputMessage.includes('data:image/')) {
      const buffer = Buffer.from(inputMessage, 'utf8');
      console.log('sending as buffer');
      this.wsConnect.sendBytes(buffer);
      reqResObj.request.messages.push({
        data: buffer,
        timeReceived: Date.now(),
      });
    } else {
      this.wsConnect.send(inputMessage);
      console.log('sending as string');
      reqResObj.request.messages.push({
        data: inputMessage,
        timeReceived: Date.now(),
      });
    }

    // update store
    event.sender.send('reqResUpdate', reqResObj);

    // listener for return message from ws server
    // push into message array under responses
    // connection.on
    this.wsConnect.on('message', (e) => {
      e.binaryData
        ? reqResObj.response.messages.push({
            data: e.binaryData,
            timeReceived: Date.now(),
          })
        : reqResObj.response.messages.push({
            data: e.utf8Data,
            timeReceived: Date.now(),
          });

      if (reqResObj.request.testContent) {
        reqResObj.response.testResult = testingController.runTest(
          reqResObj.request.testContent,
          reqResObj
        );
        console.log('the test result', reqResObj.response.testResult);
      }

      // update store
      event.sender.send('reqResUpdate', reqResObj);
    });
  },
};
module.exports = () => {
  // pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process

  // listener to open wsconnection
  ipcMain.on('open-ws', (event, reqResObj, connectionArray) => {
    wsController.openWSconnection(event, reqResObj, connectionArray);
  });

  // listener for sending messages to server
  ipcMain.on('send-ws', (event, reqResObj, inputMessage) => {
    wsController.sendWebSocketMessage(event, reqResObj, inputMessage);
  });

  // listener to close socket connection
  ipcMain.on('close-ws', (event) => {
    wsController.closeWs(event);
  });

  ipcMain.on('exportChatLog', (event, outgoingMessages, incomingMessages) => {
    // making sure the messages are in order
    const result = outgoingMessages
      .map((message) => {
        message.source = 'client';
        return message;
      })
      .concat(
        incomingMessages.map((message) => {
          message.source = 'server';
          return message;
        })
      )
      .sort((a, b) => a.timeReceived - b.timeReceived)
      .map((message, index) => ({
        index,
        source: message.source,
        data: message.data,
        timeReceived: message.timeReceived,
      }));

    const data = new Uint8Array(Buffer.from(JSON.stringify(result)));

    // showSaveDialog is the window explorer that appears
    dialog
      .showSaveDialog({ defaultPath: 'websocketLog.txt' })
      .then((file_path) => {
        fs.writeFile(file_path.filePath, data, (err) => {
          if (err) throw err;
          console.log('File saved to: ', file_path.filePath);
        });
      });
  });
};
