const FlatModel = require("../models/flatmodel.model.js");
const {  performance } = require('perf_hooks');
// Retrieve all Flatmodel from the database.
exports.findAll = (req, res) => {
  var t0 = performance.now();
  FlatModel.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving FlatModel.",
      });
    else res.send(data);
  });
  var t1 = performance.now();
  console.log("flatmodelsql took " + (t1 - t0) + "ms");
};
