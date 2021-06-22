const AllModel = require("../models/all.model.js");
const { performance } = require("perf_hooks");
// Retrieve all Flatmodel from the database.
exports.findAll = (req, res) => {
  var t0 = performance.now();

  AllModel.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving AllModel.",
      });
    else res.send(data[0]);
  });
  var t1 = performance.now();
  // console.log("findall took " + (t1 - t0) + "ms");
};

// all hdb by id
exports.getHDBById = (req, res) => {
  var id = req.params.hdb_id;
  var t0 = performance.now();
  AllModel.getHDBById(id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found All HDB with ID ${id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving HDB with ID " + id,
        });
      }
    } else res.send(data[0]);
  });
  var t1 = performance.now();
  console.log("findallbyid took " + (t1 - t0) + "ms");
};
