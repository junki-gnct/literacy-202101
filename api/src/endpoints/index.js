const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'API is online.',
  });
});

router.ws('/ws', function (ws, req) {
  let isClosed = false;
  ws.on('close', function () {
    isClosed = true;
    console.log('closed');
  });

  ws.send(JSON.stringify({ message: 'Hello!' })); // called when connection is opened.

  const keepAliveTimer = setInterval(function () {
    if (isClosed) {
      clearInterval(keepAliveTimer);
      return;
    }
    ws.send(JSON.stringify({ message: 'KeepAlive' }));
  }, 10 * 1000);
});

module.exports = router;
