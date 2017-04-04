module.exports = function (mongoose) {

    var ProductSchema = mongoose.Schema({
        name: String,
        description: String,
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.product'});

    return ProductSchema;
};