var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    Name: {
        type: String
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    Salt:{
        type:String
    },
    CreatedDate: {
        type: Date
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
    }
}
,{ collection: 'Users' });

var Users = module.exports = mongoose.model('UserModel', UserSchema);

module.exports.get = function (callback, limit) {
    Users.find(callback).limit(limit);
}