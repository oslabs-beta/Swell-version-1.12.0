import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import ngrok from 'ngrok';
import dotenv from 'dotenv';
dotenv.config();

const port: number = 3000;
const app: express.Application = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(cookieParser());

/** @todo Figure out why previous groups decided to use socket.io */
// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
// create a plain Node.JS HTTP server using the request handler functions generated by invoking express()
const server = require('http').createServer(app);

// https://www.npmjs.com/package/socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// if u want to use routers, set socket io then google the rest
// https://stackoverflow.com/questions/47249009/nodejs-socket-io-in-a-router-page
app.set('socketio', io);

io.on('connection', (client) => {
  console.log('established websocket connection');

  // client.on('message', (message) => {
  //   console.log('message received: ', message);
  // });
});

app.get('/', (_, res: Response) => res.send('Hello World!'));

app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: 'http://localhost:8080' }));

/** @todo previous groups decided to use ngrok to add live collaboration session but could not finished */
app.post('/webhookServer', (req: Request, res: Response) => {
  console.log('Server Is On!');
  ngrok
    .connect({
      proto: 'http',
      addr: '3000',
    })
    .then((url) => {
      console.log(`ngrok tunnel opened at: ${url}/webhook`);
      return res.status(200).json(url);
    });
});

/** @todo webhook is not working on swell */
app.delete('/webhookServer', (req: Request, res: Response) => {
  console.log('Server Is Off!');
  ngrok.kill();
  return res.status(200).json('the server has been deleted');
});

app.post('/webhook', (req: Request, res: Response) => {
  const data = { headers: req.headers, body: req.body };
  io.emit('response', data);
  return res.status(200).json(req.body);
});

app.get('/api/import', (_: Request, res: Response) => {
  return res.status(200).send(res.locals.swellFile);
});

//inital error handler, needs work
app.use('*', (_: Request, res: Response) => {
  res.status(404).send('Not Found');
});

// Global Handler, needs work
app.use((err: any, _1: Request, res: Response, _2: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

server.listen(port, () => console.log(`Listening on port ${port}`));






// const path = require('path');
// const express = require('express');
// const ngrok = require('ngrok');
// require('dotenv').config();

// const port = 3000;
// const app = express();
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// app.use(express.static(path.resolve(__dirname, '../../build')));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors({ origin: '*' }));

// app.use(cookieParser());

// /** @todo Figure out why previous groups decided to use socket.io */
// // https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
// // create a plain Node.JS HTTP server using the request handler functions generated by invoking express()
// const server = require('http').createServer(app);

// // https://www.npmjs.com/package/socket.io
// const io = require('socket.io')(server, {
//   cors: {
//     origin: '*',
//   },
// });

// // if u want to use routers, set socket io then google the rest
// // https://stackoverflow.com/questions/47249009/nodejs-socket-io-in-a-router-page
// app.set('socketio', io);

// io.on('connection', (client) => {
//   console.log('established websocket connection');

//   // client.on('message', (message) => {
//   //   console.log('message received: ', message);
//   // });
// });

// app.get('/', (_, res) => res.send('Hello World!'));

// app.use(express.static(path.resolve(__dirname, '../../build')));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(cors({ origin: 'http://localhost:8080' }));

// /** @todo previous groups decided to use ngrok to add live collaboration session but could not finished */
// app.post('/webhookServer', (req, res) => {
//   console.log('Server Is On!');
//   ngrok
//     .connect({
//       proto: 'http',
//       addr: '3000',
//     })
//     .then((url) => {
//       console.log(`ngrok tunnel opened at: ${url}/webhook`);
//       return res.status(200).json(url);
//     });
// });

// /** @todo webhook is not working on swell */
// app.delete('/webhookServer', (req, res) => {
//   console.log('Server Is Off!');
//   ngrok.kill();
//   return res.status(200).json('the server has been deleted');
// });

// app.post('/webhook', (req, res) => {
//   const data = { headers: req.headers, body: req.body };
//   io.emit('response', data);
//   return res.status(200).json(req.body);
// });

// app.get('/api/import', (_, res) => {
//   return res.status(200).send(res.locals.swellFile);
// });

// //inital error handler, needs work
// app.use('*', (_, res) => {
//   res.status(404).send('Not Found');
// });

// // Global Handler, needs work
// app.use((err, _1, res, _2) => {
//   const defaultErr = {
//     log: 'Express error handler caught unknown middleware error',
//     status: 500,
//     message: { err: 'An error occurred' },
//   };
//   const errorObj = { ...defaultErr, ...err };
//   console.log(errorObj.log);
//   return res.status(errorObj.status).json(errorObj.message);
// });

// module.exports = server.listen(port, () =>
//   console.log(`Listening on port ${port}`)
// );

