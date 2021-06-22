const sql = require("./db.js");
//constructor
const StreetNameWithTown = function (streetnamewithtown) {};

StreetNameWithTown.getAll = (result) => {
  sql.query("CALL retrieve_streetname_with_town()", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("StreetNameWithTown: ", res);
    result(null, res);
  });
};

module.exports = StreetNameWithTown;
