const FlatType = require("../models/flattype.model.js");
const {  performance } = require('perf_hooks');
// Retrieve all Flatmodel from the database.
exports.findAll = (req, res) => {
  var t0 = performance.now();
  FlatType.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving FlatType.",
      });
    else res.send(data);
  });
  var t1 = performance.now();
  console.log("flattypesql took " + (t1 - t0) + "ms");
};
