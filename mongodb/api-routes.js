// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to Drifter crafted with love!'
    });
});

// Import hdb controller
var hdbController = require('./hdbController');
// hdb routes
router.route('/GetAllHDB')
    .get(hdbController.getAllHDB)
router.route('/all')
    .get(hdbController.getAllHDBWithArea)
router.route('/GetAverageResalePrice')
    .get(hdbController.getAveragePriceForEachArea)
router.route('/GetAveragePriceMap')
    .get(hdbController.getAvgPriceMap)
router.route('/GetAllHDBByPrice')
    .post(hdbController.getAllByPrice)
router.route('/GetAllHDBByPriceWithArea')
    .post(hdbController.getAllByPriceWithArea)
router.route('/getHDBByIdWithoutArea/:hdb_id')
    .get(hdbController.getAllById)
    .put(hdbController.updatehdb)
    .delete(hdbController.deletehdb)
router.route('/getHDBById/:id')
    .get(hdbController.getAllWithAreaById)
router.route('/updateallresale/:resalehdbid')
    .put(hdbController.updatehdbWithArea)
router.route('/deletefromresale/:deleteID')
    .delete(hdbController.deletehdbWithArea)
router.route('/hdbInsert')
    .post(hdbController.newhdb)
router.route('/upload')
    .post(hdbController.panda) 
router.route('/hdbInsertWithArea')
    .post(hdbController.newhdbWithArea)
router.route('/hdbStorey')
    .get(hdbController.getUniqueStorey)
router.route('/hdbstoreyrange')
    .get(hdbController.getUniqueStoreyWithArea)
router.route('/flatModel')
    .get(hdbController.getFlatModel)
router.route('/flatmodel')
.get(hdbController.getFlatModelWithArea)
router.route('/flatType')
    .get(hdbController.getFlatType)
router.route('/flattype')
.get(hdbController.getFlatTypeWithArea)
router.route('/newUser')
    .post(hdbController.newUser)
router.route('/Login')
    .post(hdbController.Login)
router.route('/googleAPI')
    .post(hdbController.getGoogleAPI)
// Export API routes
module.exports = router;