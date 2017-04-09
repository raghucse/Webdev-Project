module.exports = function (mongoose, q) {

    var ShoppingSchema = require('./shopping.schema.server.js')(mongoose);
    var ShoppingModel = mongoose.model('ShoppingModel', ShoppingSchema);

    var api = {
        addItemForUser: addItemForUser,
        findItemsByItemId: findItemsByItemId,
        updateItemQuantity: updateItemQuantity,
   /*     findAllItemsForHost: findAllItemsForHost,*/
        findAllItemsForEvent: findAllItemsForEvent
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

   /*function findAllItemsForHost(hostId) {
        var deferred = q.defer();

        ShoppingModel.find({_host: hostId}, function (err, items) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(items);
            }
        });
        return deferred.promise;
    } */

    function findAllItemsForEvent(eventId) {
        var deferred = q.defer();

        ShoppingModel.find({_event: eventId}, function (err, items) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(items);
            }
        });
        return deferred.promise;
    }

    function updateItemQuantity(id, quantity) {
        var deferred = q.defer();
        ShoppingModel.update(
            { _id : id },
            {
                quantity: quantity
            }, function (err, item) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(item);
                }
            })
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

    function findItemsByItemId(itemId, hostId) {
        var deferred = q.defer();
        ShoppingModel.find({$and: [{itemId: itemId}, {_host: hostId}]}, function (err, item) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(item[0]);
            }
        });
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