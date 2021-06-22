module.exports = (app) => {
  const flatmodel = require("../controllers/flatmodel.controller.js");

  // Retrieve all FlatModel
  app.get("/flatmodel", flatmodel.findAll);
};
