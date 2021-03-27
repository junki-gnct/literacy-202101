const { configure } = require('log4js');
const mysql = require('mysql');
const mysqlPromise = require('./mysqlPromise');

async function connect() {
  const connection = mysql.createConnection({
    host: 'db',
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'literacyDB',
    charset: 'utf8mb4',
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.log(`Failed to connect to database: ${err}`);
        resolve(undefined);
      } else {
        resolve(connection);
      }
    });
  });
}

async function prepareDB(conn) {
  await mysqlPromise.query(
    conn,
    'CREATE TABLE IF NOT EXISTS literacy_data (id bigint auto_increment unique, name text, value text, created_at datetime default current_timestamp, updated_at timestamp default current_timestamp on update current_timestamp, index(id))',
  );
}

async function removeData(conn, name) {
  const where_condition = name ? ` WHERE name=${conn.escape(name)}` : '';
  const count_sql = `SELECT COUNT(*) AS count FROM literacy_data${where_condition};`;
  const count = (await mysqlPromise.query(conn, count_sql))[0].count;
  const sql = `DELETE FROM literacy_data${where_condition};`;
  await mysqlPromise.query(conn, sql);
  return count;
}

module.exports = {
  connect: connect,
  prepareDB: prepareDB,
  removeData: removeData,
};
