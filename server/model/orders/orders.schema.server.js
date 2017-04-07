module.exports = function (mongoose) {

    var q = require('q');

    var types = ['food', 'place', 'flower'];
    var ServiceSchema = mongoose.Schema({
        _vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceModel'},
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        accepted: Boolean,
        date: String,
        quote: String,
        capacity: String,
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