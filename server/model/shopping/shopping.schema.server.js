module.exports = function (mongoose) {

    var q = require('q');

    var ShoppingSchema = mongoose.Schema({
        _host: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        _guest: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        _event: {type: mongoose.Schema.Types.ObjectId, ref: 'EventModel'},
        itemId: Number,
        item: Object,
        quantity: Number,
        itemPrice: Number
    }, {collection: 'myPartyPlanDB.shopping'});

    return ShoppingSchema;
}