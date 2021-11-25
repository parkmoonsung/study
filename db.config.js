var db = {};
var mysql = require("mysql");

const pool = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "wenxing824",
  database: "apisever",
});

db.query = (sql) => {
  return new Promise((resolve, reject) => {
    if (!sql) {
      reject("SQL문법이 아닙니다.");
    }
    pool.query(sql, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows, fields);
      }
    });
  });
};

module.exports = db;
