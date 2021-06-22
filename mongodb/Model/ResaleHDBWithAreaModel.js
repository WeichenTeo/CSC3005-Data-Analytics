var mongoose = require('mongoose');
//Resale HDB Document with area
var ResaleHdbWithAreaSchema = mongoose.Schema({
    Block: {
        type: String
    },
    Floor: {
        type: Number
    },
    Postal: {
        type: String
    },
    Latitude: {
        type: Number
    },
    Longitude: {
        type: Number
    },
    LeaseCommenceDate: {
        type: Number
    },
    LeaseEndDate: {
        type: Number
    },
    ResalePrice: {
        type: Number
    },
    Area:{
        type:Object
    },
    CreatedDate: {
        type: Date
    },
    CreatedBy: {
         type:Number
    },
    UpdatedDate: {
        type: Date
    },
    UpdatedBy: {
         type:Number
    },
    FlatType: {
        type:String
    },
    FlatModel:{
        type:String
    },
    StoreyRange:{
        type:String
    },
    StreetName: {type:mongoose.Schema.Types.ObjectId, ref:'street'},
},{ collection: 'hdbWArea' }
);

 var ResaleHdbWithArea = module.exports = mongoose.model('ResaleHDBWithAreaModel', ResaleHdbWithAreaSchema);

 module.exports.get = function (callback, limit) {
    ResaleHdbWithArea.find(callback).limit(limit);
}
