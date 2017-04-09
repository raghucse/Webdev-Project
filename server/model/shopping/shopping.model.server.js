module.exports = function (mongoose, q) {

    var ShoppingSchema = require('./shopping.schema.server.js')(mongoose);
    var ShoppingModel = mongoose.model('ShoppingModel', ShoppingSchema);

    var api = {
        addItemForUser: addItemForUser,
        findAllItemsForuser: findAllItemsForuser
    /*    findAllServicesForVendor: findAllServicesForVendor,
        findServiceById: findServiceById,
        updateService: updateService,
        deleteService: deleteService,*/
    };
    return api;

    function addItemForUser(iteminfo) {
        var deferred = q.defer();
        ShoppingModel.create(iteminfo, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });

        return deferred.promise;
    }

   function findAllItemsForuser(userId) {
        var deferred = q.defer();

        ShoppingModel.find({_user: userId}, function (err, items) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(items);
            }
        });
        return deferred.promise;
    }

    function updateItem(itemId, service) {
        var deferred = q.defer();

        ServiceModel.update({_id:itemId},
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

    /*



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
    } */

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