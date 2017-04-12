module.exports = function (mongoose) {

    var q = require('q');

    var types = ['food', 'place', 'flower'];
    var ServiceSchema = mongoose.Schema({
        _vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'VendorModel'},
        type: {type: String, enum: types},
        name: String,
        description: String,
        city: String,
        address: String,
        capacity: Number,
        dateCreated: { type: Date, default: Date.now },
        perPlateCost: Number,
        orders:[{type:mongoose.Schema.Types.ObjectId, ref: 'OrderModel'}]
    }, {collection: 'myPartyPlanDB.service'});

    ServiceSchema.pre('remove', function(next) {
        this.model('VendorModel').update(
            {_id: this._vendor},
            {$pull: {services: this._id}},
            {multi: true},
            next
        );

        this.model('OrderModel')
            .find({service: this._id }, function (err, orders) {
                orders.forEach(function(order){
                    order.remove(function(err){
                    });
                })
            });

    });

    return ServiceSchema;
};