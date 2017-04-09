module.exports = function (mongoose) {

    var q = require('q');

    var ShoppingSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        itemId: Number,
        item: Object
    }, {collection: 'myPartyPlanDB.shopping'});

    return ShoppingSchema;
}