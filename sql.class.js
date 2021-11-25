const db = require("./db.config");

class sqlModel {
  checkTable() {
    var table = db.query("SHOW TABLES LIKE '%currency%'");
    return table;
  }
  creatTable() {
    var create = db.query(
      "CREATE TABLE currency (id int(11) primary key not null auto_increment,form varchar(5) not null ,to_curr varchar(5) not null ,currency varchar(20) not null)"
    );
    return create;
  }
  Add(base, coin, rates) {
    var status = db.query(
      "INSERT INTO currency (form, to_curr, currency) VALUES ('" +
        base +
        "', '" +
        coin +
        "', '" +
        rates +
        "') "
    );
    return status;
  }
  Update(rate, target, val) {
    var status = db.query(
      "UPDATE currency SET currency = '" +
        rate +
        "' WHERE " +
        target +
        " = '" +
        val +
        "'"
    );
    return status;
  }
  select(field, value) {
    var data = db.query(
      "SELECT * FROM currency WHERE " + field + " = '" + value + "'"
    );
    return data;
  }
}
module.exports = sqlModel;
