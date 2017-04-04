
module.exports = function (app) {


    var q = require("q");
    var passport = require('passport');
    var auth = authorized;
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/login', passport.authenticate('local'), login);
    app.get("/api/user", findUser);
    app.get("/api/user/:userID", findUserByID);
    app.put("/api/user/:userID", updateUser);

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder", email: "alice@gmail.com" },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley", email: "bob.marley@gmail.com"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia", email: "charly123@gmail.com"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jose2323@gmail.com" }
    ];

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function localStrategy(username, password, done) {
        findUserByCredentials(username, password)
            .then(
                function(user) {
                    user = user[0];
                    if (!user) { return done(null, false); }
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        findUserByID(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }



    function findUser(req,res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password){
            findUserByCredentials(req, res);
        }
        else if(username){
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        var user = users.find(function (u) {
            return u.username == username;
        });
        if(user){
            res.json(user);
        }
        else
        {
            res.sendStatus(404).send({message: 'User Not Found'});
        }
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        var user = users.find(function (user) {
            return user.username == username && user.password == password;
        });
        if(user){
            deferred.resolve(user);
        }
        else {
            deferred.reject();
        }
        return deferred.promise;
    }

    function findUserByID(userID) {
        var deferred = q.defer();
        var user = users.find(function (u) {
            return u._id == userID;
        });
        if(user){
            deferred.resolve(user);
        }
        else {
            deferred.reject();
        }
        return deferred.promise;
    }

    function updateUser(req, res) {
        var userId = req.params.userID;
        var newUser = req.body;
        for(var u in users){
            var user = users[u];
            if(user._id == userId){
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                users[u].username = newUser.username;
                users[u].email = newUser.email;
                res.json(user);
                return;
            }
        }
    }
};

