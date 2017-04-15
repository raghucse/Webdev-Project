
module.exports = function (app, userModel, vendorModel) {

    var bcrypt = require("bcrypt-nodejs");

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : "/auth/user/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'email']
    };

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var auth = authorized;

    passport.use('user',new LocalStrategy(localStrategy));
    passport.use('facebookUser',new FacebookStrategy(facebookConfig, facebookStrategy));

    app.post('/api/user/login/user', passport.authenticate('user','local'), login);
    app.post('/api/user/logout', logout);
    app.post('/api/user/register', register);
    app.get("/api/user", findUser);
    app.get("/api/user/:userID", findUserByID);
    app.get("/api/admin/allusers", findAllUsers);
    app.put("/api/user/:userID", updateUser);
    app.post("/api/user", createUser);
    app.delete("/api/user/:userID", deleteUser);
    app.put("/api/user/:userId/website/:websiteId", addWebsite);
    app.get('/api/loggedin', loggedin);
    app.get('/auth/user/facebook', passport.authenticate('facebookUser', { scope : 'email' }));

    app.get('/auth/user/facebook/callback',
        passport.authenticate('facebookUser', {
            failureRedirect: '/client/#/home'
        }), function (req, res) {
            if(req.user)
                res.redirect('/client/#/host/'+ req.user._id +'/event');
        });

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newFacebookUser = {
                            username:  profile.emails[0].value,
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            facebook: {
                                id:    profile.id,
                                token: token
                            },
                            type: 'USER'
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


    function localStrategy(username, password, done) {
        userModel.findUserByEmail(username)
            .then(
                function(user) {
                    if(user[0] && bcrypt.compareSync(password, user[0].password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {

        if(user[0]){
            if(user[0].vendorname) {
                vendorModel
                    .findVendorById(user[0]._id)
                    .then(
                        function (user) {
                            done(null, user);
                        },
                        function (err) {
                            done(err, null);
                        }
                    );
            }
            else{
                userModel
                    .findUserById(user[0]._id)
                    .then(
                        function (user) {
                            done(null, user);
                        },
                        function (err) {
                            done(err, null);
                        }
                    );
            }
        }
        else
        {
            if(user.vendorname) {
                vendorModel
                    .findVendorById(user._id)
                    .then(
                        function (user) {
                            done(null, user);
                        },
                        function (err) {
                            done(err, null);
                        }
                    );
            }
            else {
                userModel
                    .findUserById(user._id)
                    .then(
                        function (user) {
                            done(null, user);
                        },
                        function (err) {
                            done(err, null);
                        }
                    );
            }
        }

    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        user.type = "USER";
        userModel
            .createUser(user)
            .then(function(user){
                if(user){
                    req.login(user, function(err) {
                        if(err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function createUser(req, res) {
        var newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.password);
        newUser.type = "USER";
        userModel.createUser(newUser)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUser(req, res) {
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
        userModel.findUserByUsername(username)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                if(users.length != 0){
                    res.json(users);
                }
                else{
                    res.sendStatus(500).send('err');
                }
            }, function (err) {
                res.sendStatus(500).send('err');

            });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        userModel.findUserByCredentials(username, password)
            .then(function (user) {
                if(user.length != 0){
                    res.json(user);
                }
                else{
                    res.sendStatus(500).send('err');
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserByID(req, res) {
        var userID = req.params.userID;
        userModel.findUserById(userID)
            .then(function (user) {
                if(user.length != 0){
                    res.json(user);
                }
                else{
                    res.sendStatus(500).send('err');
                }
            }, function (err) {
                res.sendStatus(404).send({message: 'User Not Found'});
            });
    }

    function updateUser(req, res) {
        var userId = req.params.userID;
        var newUser = req.body;
        userModel.updateUser(userId, newUser)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteUser(req, res) {
        var userId = req.params.userID;
        userModel.deleteUser(userId)
            .then(function (user) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function addWebsite(req, res) {
        var userId = req.params.userId;
        var websiteId = req.params.websiteId;
        userModel.addWebsite(userId, websiteId)
            .then(function (user) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }
};

