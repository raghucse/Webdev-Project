module.exports = function (mongoose) {

    var q = require('q');


    var OrderSchema = mongoose.Schema({
        vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'VendorModel'},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        service: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceModel'},
        accepted: Boolean,
        date: String,
        quote: String,
        capacity: String,
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.order'});

    return OrderSchema;
};