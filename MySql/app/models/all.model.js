const sql = require("./db.js");
//constructor
const AllModel = function (all) { };

AllModel.getAll = (result) => {
  sql.query("CALL retrieve_all()", (err, res) => {
    //Using Stored Procedure instead of SQL queries
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("AllModel: ", res);
    result(null, res);
  });
};


AllModel.getHDBById = (id, result) => {
  sql.query(
    "CALL retrieve_hdb_by_id(?)", [id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("AllModel: ", res);
      result(null, res);
      console.log("Result: ", res);
    }
  );
};
module.exports = AllModel;
