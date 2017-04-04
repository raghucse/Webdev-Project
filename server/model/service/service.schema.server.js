module.exports = function (mongoose) {

    var types = ['FOOD', 'PLACE', 'FLOWERS'];
    var ServiceSchema = mongoose.Schema({
        type: {type: String, enum: types},
        name: String,
        description: String,
        url: String,
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.service'});

    return ServiceSchema;
};