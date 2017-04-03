module.exports = function (mongoose) {

    var ServiceSchema = mongoose.Schema({
        name: String,
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.service'});

    return ServiceSchema;
};