module.exports = function (mongoose) {
    var q = require('q');

    var userModel = require('./user/user.model.server')(mongoose, q);
    var eventModel = require('./event/event.model.server')(mongoose, q);
    var productModel = require('./product/product.model.server')(mongoose, q);
    var serviceModel = require('./service/service.model.server')(mongoose, q);
    var vendorModel = require('./vendor/vendor.model.server')(mongoose, q);


    var model = {
        userModel: userModel,
        eventModel : eventModel,
        productModel : productModel,
        serviceModel : serviceModel,
        vendorModel : vendorModel
    };

    return model;
};