module.exports = function (mongoose) {
    var q = require('q');

    var userModel = require('./user/user.model.server')(mongoose, q);
    var eventModel = require('./event/event.model.server')(mongoose, q);
    var serviceModel = require('./service/service.model.server')(mongoose, q);
    var vendorModel = require('./vendor/vendor.model.server')(mongoose, q);
    var inviteModel = require('./invite/invite.model.server.js')(mongoose, q);
    var orderModel = require('./orders/orders.model.server')(mongoose, q);
    var shoppingModel = require('./shopping/shopping.model.server')(mongoose, q);

    var model = {
        userModel: userModel,
        eventModel : eventModel,
        serviceModel : serviceModel,
        vendorModel : vendorModel,
        inviteModel : inviteModel,
        orderModel : orderModel,
        shoppingModel : shoppingModel
    };

    return model;
};