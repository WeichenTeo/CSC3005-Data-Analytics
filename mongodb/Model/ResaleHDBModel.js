var mongoose = require('mongoose');
//Resale HDB Collection
var ResaleHdbSchema = mongoose.Schema({
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
 
},{ collection: 'hdb' }
);

 var ResaleHdb = module.exports = mongoose.model('resaleHDB', ResaleHdbSchema);

 module.exports.get = function (callback, limit) {
    ResaleHdb.find(callback).limit(limit);
}
