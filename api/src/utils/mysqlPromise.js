// code from: https://tech.chakapoko.com/nodejs/mysql/promise.html
const beginTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const query = (connection, statement, params) => {
  return new Promise((resolve, reject) => {
    connection.query(statement, params, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results, fields);
      }
    });
  });
};

const commit = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

const rollback = (connection, err) => {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      reject(err);
    });
  });
};

module.exports = {
  beginTransaction: beginTransaction,
  query: query,
  commit: commit,
  rollback: rollback,
};
