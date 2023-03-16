const http = require('http');
const express = require('express');
const app = express();
const io = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const server = http.createServer(app);
const socket = io(server, { cors: { origin: '*' }, });
const data = require('./data');

socket.sockets.on('connection', (socket) => {
  setInterval(() => {
    socket.emit('STS', data.STS);
  }, 1500);
  socket.on('upload_request', data => {
    console.log(data);
  });
});

app.use(express.json());
app.use(express.static('./'));
app.use(cors());

app.get('/', (req, res, next) => {
  res.send(`개발툴 콘솔창에 fetch("${process.env.SOCKET}")`);
  socket.emit('newEvent', data.EVENT);
});

app.use((req, res, next)=>{
  const err = new Error('404')
  err.status = 404;
  next(err);
});
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  console.log(err);
  res.send(err.message);
});

server.listen(9000, () => {
  console.log(`server listen: ${process.env.SOCKET}`);
});

process.on('uncaughtException', (err)=>{
  console.log(err);
});
