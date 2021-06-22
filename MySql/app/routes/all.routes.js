module.exports = (app) => {
  const allmodel = require("../controllers/all.controller.js");

  // Retrieve all FlatModel
  app.get("/all", allmodel.findAll);
  app.get("/getHDBById/:hdb_id",allmodel.getHDBById);
};
