module.exports = function (mongoose, q) {

    var UserSchema = require('./user.schema.server')(mongoose);
    var UserModel = mongoose.model('UserModel', UserSchema);
    var bcrypt = require("bcrypt-nodejs");

    UserModel.createUser = createUser;
    UserModel.findUserById = findUserById;
    UserModel.findUserByUsername = findUserByUsername;
    UserModel.findUserByCredentials = findUserByCredentials;
    UserModel.updateUser =  updateUser;
    UserModel.deleteUser = deleteUser;
    UserModel.addWebsite = addWebsite;

    module.exports = UserModel;

    var api ={
        "createUser" : createUser,
        "findUserById" : findUserById,
        "findUserByUsername" : findUserByUsername,
        "findUserByCredentials" : findUserByCredentials,
        "updateUser" : updateUser,
        "deleteUser" : deleteUser,
        "addWebsite" : addWebsite,
        "findUserByFacebookId" : findUserByFacebookId,
        "findAllUsers" : findAllUsers,
        "findUserByEmail" : findUserByEmail
    };
    return api;

    function createUser(user) {
        var deferred = q.defer();
        UserModel.create(user, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();

        UserModel.findById(userId, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();

        UserModel.find({$and: [{username: username}, {type: "USER"}]}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findUserByEmail(username) {
        var deferred = q.defer();

        UserModel.find({username: username}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findAllUsers() {
        var deferred = q.defer();

        UserModel.find({},function (err, users) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(users);
            }
        });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();

        UserModel.find({$and: [{username: username}, {password: password}]}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function updateUser(userId, user) {
        var deferred = q.defer();
        UserModel.update(
            { _id : userId },
            {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }, function (err, user) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();
        UserModel.findByIdAndRemove({_id: userId}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                user.remove();
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function addWebsite(userId, websiteId) {
        var deferred = q.defer();
        UserModel.findById(userId, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                user.websites.push(websiteId);
                user.save();
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function findUserByFacebookId(facebookId) {
        var deferred = q.defer();

        UserModel.findOne({'facebook.id': facebookId}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }
};
