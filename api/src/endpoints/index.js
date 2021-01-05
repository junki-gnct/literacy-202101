const express = require('express');
const router = express.Router();

let ws_utils = require('../utils/websocket');

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'API is online.',
    clients: ws_utils.ws_clients.length,
  });
});

router.get('/broadcast', function (req, res) {
  ws_utils.broadcast(
    JSON.stringify({ message: 'This is a broadcast message!' }),
  );
  res.status(200).json({
    clients: ws_utils.ws_clients.length,
  });
});

router.get('/send', function (req, res) {
  if (req.query.name == null || req.query.value == null) {
    res.status(400).json({
      message: 'Invalid parameters.',
    });
    return;
  }

  ws_utils.broadcast(
    JSON.stringify({
      name: req.query.name,
      value: req.query.value,
    }),
  );

  res.status(200).json({
    message: 'OK',
  });
});

router.ws('/ws', function (ws, req) {
  let isClosed = false;
  ws.on('close', function () {
    isClosed = true;
    ws_utils.ws_clients.splice(ws_utils.ws_clients.indexOf(ws), 1);
    console.log('closed');
  });

  ws.send(JSON.stringify({ message: 'Hello!' })); // called when connection is opened.
  ws_utils.ws_clients.push(ws);

  const keepAliveTimer = setInterval(function () {
    if (isClosed) {
      clearInterval(keepAliveTimer);
      return;
    }
    ws.send(JSON.stringify({ message: 'KeepAlive' }));
  }, 10 * 1000);
});

module.exports = router;
