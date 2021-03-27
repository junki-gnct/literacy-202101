const express = require('express');
const database = require('../utils/database');

let ws_utils = require('../utils/websocket');

class IndexRoutes extends express.Router {
  constructor(conn) {
    super();

    this.get('/', function (req, res) {
      res.status(200).json({
        message: 'API is online.',
        clients: ws_utils.ws_clients.length,
      });
    });

    this.get('/send', function (req, res) {
      if (req.query.name == null || req.query.value == null) {
        res.status(400).json({
          message: 'Invalid parameters.',
        });
        return;
      }

      ws_utils.recv_data(req.query.name, req.query.value);
      ws_utils.broadcast(
        JSON.stringify({
          name: req.query.name,
          value: req.query.value,
        }),
      );

      // save data if the value is number.

      res.status(200).json({
        message: 'OK',
      });
    });

    this.get('/remove', async function (req, res) {
      if (req.query.name == null && req.query.target == null) {
        res.status(400).json({
          message: 'Invalid parameters.',
        });
        return;
      }
      const count = await database.removeData(
        conn,
        req.query.name == null && req.query.target == 'all'
          ? null
          : req.query.name,
      );
      res.status(200).json({
        message: 'OK',
        count: count,
      });
    });

    this.ws('/ws', function (ws, req) {
      let isClosed = false;
      ws.on('close', function () {
        isClosed = true;
        ws_utils.ws_clients.splice(ws_utils.ws_clients.indexOf(ws), 1);
        console.log('closed');
      });

      ws.send(
        JSON.stringify({ initialize: Object.values(ws_utils.received_data) }),
      ); // called when connection is opened.
      ws_utils.ws_clients.push(ws);

      const keepAliveTimer = setInterval(function () {
        if (isClosed) {
          clearInterval(keepAliveTimer);
          return;
        }
        ws.send(JSON.stringify({ message: 'KeepAlive' }));
      }, 10 * 1000);
    });
  }
}

module.exports = IndexRoutes;
