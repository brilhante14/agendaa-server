const mysql = require('mysql2');
const util = require('util');

const db = {};
db.exec = async (sql, values) => {
   const conn = mysql.createConnection({
      host: "mysqldb",
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: 3306,
    });

    const query = util.promisify(conn.query).bind(conn);

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.log(error);
      return [];
    } finally {
      conn.end();
    }
};

module.exports = db;