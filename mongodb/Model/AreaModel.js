var mongoose = require('mongoose');

var AreaSchema = mongoose.Schema({
    Name: {
        type: String
    },

    Town:{
        type: String
    },
    CreatedDate: {
        type: Date,
         default: Date.now
    },
    CreatedBy: {
         type:Number
    },
    UpdatedDate: {
        type: Date,
         default: Date.now
    },
    UpdatedBy: {
         type:Number
    },
    town: {type:mongoose.Schema.Types.ObjectId, ref:'town'}
},{ collection: 'area' }
);

var area = module.exports = mongoose.model('area', AreaSchema);

module.exports.get = function (callback, limit) {
    street.find(callback).limit(limit);
}
