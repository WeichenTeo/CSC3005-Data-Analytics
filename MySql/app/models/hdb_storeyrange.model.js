const sql = require("./db.js");
//constructor
const HDBStoreyRange = function (hdbstoreyrange) {};

HDBStoreyRange.getAll = (result) => {
  sql.query("CALL retrieve_storeyrange()", (err, res) => {
    //Using Stored Procedure instead of SQL queries
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Storeyrange: ", res);
    result(null, res);
  });
};

module.exports = HDBStoreyRange;
