module.exports = (app) => {
  const hdbstoreyrange = require("../controllers/hdb_storeyrange.controller.js");


  // Retrieve all HDB Storeyrange
  app.get("/hdbstoreyrange", hdbstoreyrange.findAll);

};
