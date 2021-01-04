const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'API is online.',
  });
});

router.ws('/ws', function (ws, req) {
  ws.on('close', function () {
    console.log('closed');
  });

  ws.on('message', function (msg) {
    ws.send(msg);
  });

  ws.send('Hello!'); // called when connection is opened.
});

module.exports = router;
