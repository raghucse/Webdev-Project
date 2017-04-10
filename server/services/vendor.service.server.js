
module.exports = function(app, vendorModel) {

    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'name', 'email']
    };
    var bcrypt = require("bcrypt-nodejs");

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    var auth = authorized;

    app.post('/vendor/login', passport.authenticate('local'), login);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.post('/api/logout',logout);
    app.get('/api/loggedin',loggedin);
    app.post ('/api/register', register);
    app.get("/api/vendor", findVendor);
    app.get("/api/vendor/:vendorId", findVendorById);
    app.put("/api/vendor/:vendorId", updateVendor);
    app.delete("/api/vendor/:vendorId",deleteVendor);
    app.post("/api/vendor",createVendor);
    app.put("/api/vendor/:vendorId/service/:serviceId", updateService);

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/'
        }), function (req, res) {
            res.redirect('/assignment/#/vendor/' + req.vendor._id);
        });

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        vendorModel
            .findVendorByFacebookId(profile.id)
            .then(
                function(vendor) {
                    if(vendor) {

                        return done(null, vendor);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newFacebookVendor = {
                            vendorname:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:    email,
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return vendorModel.createVendor(newFacebookVendor);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(vendor){
                    return done(null, vendor);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


    function localStrategy(username, password, done) {
        console.log("vendor Login called")
        console.log(username);
        vendorModel.findVendorByVendorname(username)
            .then(
                function(vendor) {
                    console.log(vendor[0]);
                    if(vendor[0] && bcrypt.compareSync(password, vendor[0].password)) {
                        return done(null, vendor);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    passport.serializeUser(serializeVendor);
    passport.deserializeUser(deserializeVendor);

    function serializeVendor(vendor, done) {
        done(null, vendor);
    }

    function deserializeVendor(vendor, done) {
        if(vendor[0]){
            vendorModel
                .findVendorById(vendor[0]._id)
                .then(
                    function(vendor){
                        done(null, vendor);
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }
        else
        {
            vendorModel
                .findVendorById(vendor._id)
                .then(
                    function(vendor){
                        done(null, vendor);
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }

    }

    function register (req, res) {
        var vendor = req.body;
        vendor.password = bcrypt.hashSync(vendor.password);
        vendorModel
            .createVendor(vendor)
            .then(
                function(vendor){
                    if(vendor){
                        req.login(vendor, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(vendor);
                            }
                        });
                    }
                }
            );
    }

    function login(req, res) {
        var vendor = req.user;
        res.json(vendor);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.vendor : '0');
    }

    function createVendor(req, res) {
        var newVendor = req.body;
        vendorModel.createVendor(newVendor)
            .then(function (vendor) {
                res.json(vendor);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findVendor(req, res) {
        var vendorname = req.query.vendorname;
        var password = req.query.password;
        if(vendorname && password) {
            findVendorByCredentials(req, res);
        } else if(vendorname) {
            findVendorByVendorname(req, res);
        }
    }


    function findVendorById(req, res) {
        var vendorId = req.params.vendorId;
        vendorModel.findVendorById(vendorId)
            .then(function (vendor) {
                res.json(vendor);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findVendorByVendorname(req, res) {
        var vendorname = req.query.vendorname;
        vendorModel.findVendorByVendorname(vendorname)
            .then(function (vendor) {
                res.json(vendor);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findVendorByCredentials(req, res){
        var vendorname = req.query.vendorname;
        var password = req.query.password;
        vendorModel.findVendorByCreadentials(vendorname, password)
            .then(function (vendor) {
                res.json(vendor);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function updateVendor(req, res) {
        var vendorId = req.params.vendorId;
        var newVendor = req.body;
        vendorModel.updateVendor(vendorId, newVendor)
            .then(function (vendor) {
                res.json(vendor);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function deleteVendor(req, res) {
        var vendorId = req.params.vendorId;
        vendorModel.deleteVendor(vendorId)
            .then(function (vendor) {
                res.send(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function updateService(req, res) {
        var vendorId = req.params.vendorId;
        var serviceId = req.params.serviceId;

        vendorModel.updateService(vendorId, serviceId)
            .then(function (vendor) {
                res.send(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

};