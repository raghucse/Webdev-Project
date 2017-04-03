module.exports = function (mongoose, q) {

    var ProductSchema = require('./product.schema.server')(mongoose);
    var ProductModel = mongoose.model('ProductModel', ProductSchema);
};