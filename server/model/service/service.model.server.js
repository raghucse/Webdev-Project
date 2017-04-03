module.exports = function (mongoose, q) {

    var ServiceSchema = require('./service.schema.server')(mongoose);
    var ServiceModel = mongoose.model('ServiceModel', ServiceSchema);

};