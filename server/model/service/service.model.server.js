module.exports = function (mongoose, q) {

    var ServiceSchema = require('./service.schema.server')(mongoose);
    var ServiceModel = mongoose.model('ServiceModel', ServiceSchema);

    var api = {
        createServiceForVendor: createServiceForVendor,
        findAllServicesForVendor: findAllServicesForVendor,
        findAllServicesInCity: findAllServicesInCity,
        findServiceById: findServiceById,
        updateService: updateService,
        deleteService: deleteService,
        updateOrder : updateOrder
    };
    return api;

    function createServiceForVendor(vendorId, service) {
        var deferred = q.defer();
        service._vendor = vendorId;
        ServiceModel.create(service, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });

        return deferred.promise;
    }

    function findAllServicesForVendor(vendorId) {
        var deferred = q.defer();

        ServiceModel.find({_vendor: vendorId}, function (err, services) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(services);
            }
        });

        return deferred.promise;
    }

    function findAllServicesInCity(cityname) {
        var deferred = q.defer();
        ServiceModel.find({city: cityname}, function (err, services) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(services);
            }
        });
        return deferred.promise;
    }

    function findServiceById(serviceId) {
        var deferred = q.defer();

        ServiceModel.findById(serviceId, function (err, service) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(service);
            }
        });
        return deferred.promise;
    }

    function updateService(serviceId, service) {
        var deferred = q.defer();

        ServiceModel.update({_id:serviceId},
            {$set:service}
            , function (err, service) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(service);
                }
            });
        return deferred.promise;

    }

    function deleteService(serviceId) {
        var deferred = q.defer();
        ServiceModel.findById(serviceId, function (err, service) {
            if(err){
                deferred.reject(err);
            }
            else {
                service.remove(function (err) {
                    deferred.resolve();
                });
            }
        })
        return deferred.promise;
    }

    function updateOrder(serviceId, orderId) {
        var deferred = q.defer();
        ServiceModel.findById(serviceId, function (err, service) {
            if(err){
                deferred.reject(err);
            }
            else {
                service.orders.push(orderId);
                service.save();
                deferred.resolve();
            }});
        return deferred.promise;
    }
};