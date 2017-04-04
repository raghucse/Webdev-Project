module.exports = function (mongoose) {

    var EventSchema = mongoose.Schema({
        host: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        name: String,
        location: String,
        date: String,
        time: String,
        guests: String,
        phone: String,
        address: String,
        services: [{type:mongoose.Schema.Types.ObjectId, ref: 'ServiceModel'}],
        products: [{type:mongoose.Schema.Types.ObjectId, ref: 'ProductModel'}],
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.event'});

    return EventSchema;
};