module.exports = function (mongoose) {

    var EventSchema = mongoose.Schema({
        host: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        name: String,
        description : String,
        location: String,
        date: String,
        time: String,
        services: [{type:mongoose.Schema.Types.ObjectId, ref: 'ServiceModel'}],
        products: [{type:mongoose.Schema.Types.ObjectId, ref: 'ProductModel'}],
        guests : [{type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.event'});

    return EventSchema;
};