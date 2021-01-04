(async () => {
  const log4js = require('log4js');
  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const expressWS = require('express-ws')(app);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const index = require('./endpoints');
  const template = require('./endpoints/template');
  app.use('/', index);
  app.use('/template', template);

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
  systemLogger.info('API server started.');

  app.listen(3000);
  console.log('listen on port 3000');
})();
