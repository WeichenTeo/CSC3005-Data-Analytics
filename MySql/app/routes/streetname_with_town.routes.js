module.exports = (app) => {
  const streetnamewithtown = require("../controllers/streetname_with_town.controller.js");

  // Retrieve all LocationType
  app.get("/streetnamewithtown", streetnamewithtown.findAll);
};
