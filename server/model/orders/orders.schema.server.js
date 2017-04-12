module.exports = function (mongoose) {

    var q = require('q');


    var OrderSchema = mongoose.Schema({
        vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'VendorModel'},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        service: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceModel'},
        accepted: Boolean,
        cancelled: Boolean,
        date: String,
        time: String,
        quote: String,
        cost: Number,
        platesrequested : Number,
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.order'});

    OrderSchema.pre('remove', function(next) {
        this.model('ServiceModel').update(
            {_id: this.service},
            {$pull: {orders: this._id}},
            {multi: true},
            next
        );
    });

    return OrderSchema;
};