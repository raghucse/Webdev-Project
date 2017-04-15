
module.exports = function (app) {

    var mongoose = require('mongoose');

    var connectionString = 'mongodb://127.0.0.1:27017/myPartyPlanDB';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    mongoose.connect(connectionString, function (err, db) {
        if(err){
        }
    });

    var model = require('./model/model.server')(mongoose);

    require("./services/user.service.server.js")(app, model.userModel, model.vendorModel);
    require("./services/event.service.server.js")(app, model.eventModel);
    require("./services/service.service.server.js")(app, model.serviceModel);
    require("./services/vendor.service.server.js")(app, model.vendorModel);
    require("./services/invite.service.server")(app, model.inviteModel);
    require("./services/order.service.server")(app, model.orderModel);
    require("./services/shopping.service.server")(app, model.shoppingModel);
};