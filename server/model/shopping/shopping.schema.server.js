module.exports = function (mongoose) {

    var q = require('q');

    var ShoppingSchema = mongoose.Schema({
        _host: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        _guest: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        _event: {type: mongoose.Schema.Types.ObjectId, ref: 'EventModel'},
        guest: Object,
        itemId: Number,
        item: Object,
        quantity: Number,
        itemPrice: Number
    }, {collection: 'myPartyPlanDB.shopping'});

    ShoppingSchema.pre('remove', function(next) {

        this.model('EventModel').update(
            {_id: this._event},
            {$pull: {products: this._id}},
            {multi: true},
            next
        );

    });

    return ShoppingSchema;
}