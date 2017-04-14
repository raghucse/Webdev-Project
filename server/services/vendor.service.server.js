
module.exports = function(app, vendorModel) {

    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : "/auth/vendor/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'email']
    };
    var bcrypt = require("bcrypt-nodejs");

    passport.use('vendor', new LocalStrategy(localStrategy));
    passport.use('facebookVendor',new FacebookStrategy(facebookConfig, facebookStrategy));

    var auth = authorized;

    app.post('/vendor/login', passport.authenticate('vendor','local'), login);
    app.get ('/auth/vendor/facebook', passport.authenticate('facebookVendor', { scope : 'email' }));
    app.post('/api/logout',logout);
    app.get('/api/vendor/loggedin',loggedin);
    app.post ('/api/vendor/register', register);
    app.get("/api/vendor", findVendor);
    app.get("/api/vendor/:vendorId", findVendorById);
    app.get("/api/vendor/city/name", findVendorByCity);
    app.put("/api/vendor/:vendorId", updateVendor);
    app.delete("/api/vendor/:vendorId",deleteVendor);
    app.post("/api/vendor",createVendor);
    app.put("/api/vendor/:vendorId/service/:serviceId", updateService);
    app.get("/api/vendor", findAllVendors);

    app.get('/auth/vendor/facebook/callback',
        passport.authenticate('facebookVendor', {
            failureRedirect: '/client/#/home'
        }), function (req, res) {
            res.redirect('/client/#/vendor/' + req.user._id +'/service');
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
                        var newFacebookVendor = {
                            vendorname:  profile.emails[0].value,
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
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
        vendorModel.findVendorByVendorname(username)
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

    function register (req, res) {
        var vendor = req.body;
        vendor.password = bcrypt.hashSync(vendor.password);
        vendorModel
            .createVendor(vendor)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
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

    function findVendorByCity(req, res) {
        var cityname = req.query.name;
        vendorModel.findVendorByCity(cityname)
            .then(function (vendors) {
                res.json(vendors);
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

    function findAllVendors(req, res) {
        vendorModel.findAllVendors()
            .then(function (vendors) {
                res.json(vendors);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

};