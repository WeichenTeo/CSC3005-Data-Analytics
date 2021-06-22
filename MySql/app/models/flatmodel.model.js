const sql = require("./db.js");
//constructor
const FlatModel = function (flatmodel) {};

FlatModel.getAll = (result) => {
  sql.query("CALL retrieve_flatmodel()", (err, res) => {
    //Using Stored Procedure instead of SQL queries
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("FlatType: ", res);
    result(null, res);
  });
};

module.exports = FlatModel;
