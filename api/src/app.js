(async () => {
  const log4js = require('log4js');
  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const expressWS = require('express-ws')(app);
  const database = require('./utils/database');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Configure logger
  log4js.configure('./src/config/log4js.config.json');
  const systemLogger = log4js.getLogger('system');
  const httpLogger = log4js.getLogger('http');
  const accessLogger = log4js.getLogger('access');
  app.use(log4js.connectLogger(accessLogger));
  app.use((req, res, next) => {
    if (
      typeof req === 'undefined' ||
      req === null ||
      typeof req.method === 'undefined' ||
      req.method === null ||
      typeof req.header === 'undefined' ||
      req.header === null
    ) {
      next();
      return;
    }
    if (req.method === 'GET' || req.method === 'DELETE') {
      httpLogger.info(req.query);
    } else {
      httpLogger.info(req.body);
    }
    next();
  });

  // Connect to database.
  systemLogger.info('Connecting to database...');
  console.log('Connecting to database...');
  let connection = await database.connect();
  while (connection == undefined) {
    console.log('Waiting for database server...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    connection = await database.connect();
  }
  systemLogger.info('Database connection has been established.');
  console.log('Database connection has been established.');

  console.log('Preparing database table...');
  await database.prepareDB(connection);
  console.log('OK.');

  // keepalive timer.
  setInterval(function () {
    connection.query('SELECT 1');
  }, 5000);

  // Routing settings.
  const index = require('./endpoints');
  const template = require('./endpoints/template');
  app.use('/', new index(connection));
  app.use('/template', template);

  app.listen(3000);
  systemLogger.info('API server started.');
  console.log('listen on port 3000');
})();
