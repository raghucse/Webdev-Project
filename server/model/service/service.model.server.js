module.exports = function (mongoose, q) {

    var ServiceSchema = require('./service.schema.server')(mongoose);
    var ServiceModel = mongoose.model('ServiceModel', ServiceSchema);

    var api = {
        createServiceForUser: createServiceForUser,
        findAllServicesForUser: findAllServicesForUser,
        findServiceById: findServiceById,
        updateService: updateService,
        deleteService: deleteService,
    };
    return api;

    function createServiceForUser(userId, service) {
        var deferred = q.defer();
        service._user = userId;
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

    function findAllServicesForUser(userId) {
        var deferred = q.defer();

        ServiceModel.find({_user: userId}, function (err, services) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(services);
            }
        })

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
        })
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
            })
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

    /*function updatePage(serviceId, pageId) {
        var deferred = q.defer();
        ServiceModel.findById(serviceId, function (err, service) {
            if(err){
                deferred.reject(err);
            }
            else {
                service.pages.push(pageId);
                service.save();
                deferred.resolve();
            }
        })
        return deferred.promise;
    }*/
}