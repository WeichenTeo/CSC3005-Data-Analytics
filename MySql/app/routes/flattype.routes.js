module.exports = (app) => {
  const flattype = require("../controllers/flattype.controller.js");

  // Retrieve all FlatModel
  app.get("/flattype", flattype.findAll);
};

