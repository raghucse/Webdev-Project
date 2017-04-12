module.exports = function (mongoose, q) {

    var VendorSchema = require('./vendor.schema.server')(mongoose);
    var VendorModel = mongoose.model('VendorModel', VendorSchema);

    var api = {
        createVendor: createVendor,
        findVendorById: findVendorById,
        findVendorByVendorname: findVendorByVendorname,
        findVendorByCity: findVendorByCity,
        findVendorByCreadentials: findVendorByCreadentials,
        updateVendor: updateVendor,
        deleteVendor: deleteVendor,
        updateService: updateService,
        findVendorByFacebookId: findVendorByFacebookId,
        findAllVendors: findAllVendors
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

    function findVendorByVendorname(vendorname) {
        var deferred = q.defer();
        VendorModel.find({vendorname: vendorname}, function (err, vendor) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(vendor);
            }
        });
        return deferred.promise;
    }

    function findVendorByCity(cityname) {
        var deferred = q.defer();
        VendorModel.find({cityname: cityname}, function (err, vendors) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(vendors);
            }
        });
        return deferred.promise;
    }

    function findVendorByCreadentials(vendorname, password) {
        var deferred = q.defer();

        VendorModel.find({$and: [{vendorname: vendorname}, {password: password}]}, function (err, vendor) {
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
            { _id : vendorId }, vendor
            , function (err, vendor) {
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

    function findAllVendors() {
        var deferred = q.defer();

        VendorModel.find({},function (err, vendors) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(vendors);
            }
        });
        return deferred.promise;
    }

};