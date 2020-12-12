var mysql = require("mysql");

MYSQL_HOST = "findtroll.ci8vlkmfvuq6.ap-northeast-2.rds.amazonaws.com";
MYSQL_USER = "admin";
MYSQL_PASSWORD = "9UdLF5Kg";
RIOT_API_KEY = "RGAPI-c5c7eaa5-0cd3-401d-a9e0-8f3b564d4a9a";

var connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: "FindTroll",
  dateStrings: "true",
  port: 3306,
  acquireTimeout: 30000, //30 secs
});

connection.connect();

module.exports = {
  async do(query, value) {
    return new Promise((resolve, reject) => {
      connection.query(query, value, function (err, rows, fields) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(rows);
      });
    });
  },
};
