module.exports = function (mongoose, q) {

    var VendorSchema = require('./vendor.schema.server')(mongoose);
    var VendorModel = mongoose.model('VendorModel', VendorSchema);

    var api = {
        createVendor: createVendor,
        findVendorById: findVendorById,
        findVendorByVendorname: findVendorByVendorname,
        findVendorByCreadentials: findVendorByCreadentials,
        updateVendor: updateVendor,
        deleteVendor: deleteVendor,
        updateService: updateService,
        findVendorByFacebookId: findVendorByFacebookId,
    };

    return api;

    function findVendorByFacebookId(facebookId) {
        var deferred = q.defer();
        VendorModel.findOne({'facebook.id': facebookId},function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function createVendor(vendor) {
        var deferred = q.defer();

        VendorModel.create(vendor, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findVendorById(vendorId) {
        var deferred = q.defer();

        VendorModel.findById(vendorId, function (err, vendor) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(vendor);
            }
        })
        return deferred.promise;
    }

    function findVendorByVendorname(username) {
        var deferred = q.defer();
        VendorModel.find({username: username}, function (err, vendor) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(vendor);
            }
        })
        return deferred.promise;
    }

    function findVendorByCreadentials(username, password) {
        var deferred = q.defer();

        VendorModel.find({$and: [{username: username}, {password: password}]}, function (err, vendor) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(vendor);
            }
        })
        return deferred.promise;
    }

    function updateVendor(vendorId, vendor) {
        var deferred = q.defer();
        VendorModel.update(
            { _id : vendorId },
            {
                firstName: vendor.firstName,
                lastName: vendor.lastName,
                email: vendor.email
            }, function (err, vendor) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(vendor);
                }
            })
        return deferred.promise;
    }

    function deleteVendor(vendorId) {
        var deferred = q.defer();
        VendorModel.findById(vendorId, function (err, vendor) {
            if(err){
                deferred.reject(err);
            }
            else {
                vendor.remove(function (err) {
                    deferred.resolve();
                });
            }
        })
        return deferred.promise;
    }

    function updateService(vendorId, serviceId) {
        var deferred = q.defer();
        VendorModel.findById(vendorId, function (err, vendor) {
            if(err){
                deferred.reject(err);
            }
            else {
                vendor.services.push(serviceId);
                vendor.save();
                deferred.resolve();
            }
        })
        return deferred.promise;
    }

};