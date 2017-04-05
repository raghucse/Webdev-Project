module.exports = function (mongoose) {

    var q = require('q');

    var types = ['FOOD', 'PLACE', 'FLOWERS'];
    var ServiceSchema = mongoose.Schema({
        _vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'VendorModel'},
        type: {type: String, enum: types},
        name: String,
        description: String,
        url: String,
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.service'});

    ServiceSchema.pre('remove', function(next) {
        this.model('VendorModel').update(
            {_id: this._vendor},
            {$pull: {services: this._id}},
            {multi: true},
            next
        );

    });

    return ServiceSchema;
}