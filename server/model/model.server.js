module.exports = function (mongoose) {
    var q = require('q');

    var userModel = require('./user/user.model.server')(mongoose, q);


    var model = {
        userModel: userModel
    };

    return model;
};