const StreetNameWithTown = require("../models/streetname_with_town.model.js");
const {  performance } = require('perf_hooks');
// Retrieve all HDB Street from the database.
exports.findAll = (req, res) => {
  var t0 = performance.now();
  StreetNameWithTown.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving StreetNameWithTown.",
      });
    else res.send(data);
  });
  var t1 = performance.now();
  console.log("streetnamewithtown took " + (t1 - t0) + "ms");
};
