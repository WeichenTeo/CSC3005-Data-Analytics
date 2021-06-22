const HDBStoreyRange = require("../models/hdb_storeyrange.model.js");
const {  performance } = require('perf_hooks');

// Retrieve all HDB Storey Range from the database.
exports.findAll = (req, res) => {
  var t0 = performance.now();
  HDBStoreyRange.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving HDBStoreyRange.",
      });
    else res.send(data);
  });
  var t1 = performance.now();
    console.log("storey range sql took " + (t1 - t0) + "ms");
};
