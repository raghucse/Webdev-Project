module.exports = function (mongoose, q) {

    var EventSchema = require('./event.schema.server')(mongoose);
    var EventModel = mongoose.model('EventModel', EventSchema);

    var api = {
        "createEventForUser": createEventForUser,
        "findAllEventsForUser": findAllEventsForUser,
        "findEventById": findEventById,
        "updateEvent": updateEvent,
        "deleteEvent": deleteEvent,
        "addService": addService,
        "addProduct": addProduct 
    };

    return api;
    
    function createEventForUser(hostId, event) {
        var deferred = q.defer();
        event.host = hostId;
        EventModel.create(event, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }
    
    function findAllEventsForUser(hostId) {
        var deferred = q.defer();
        EventModel.find({host: hostId}, function (err, events) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(events);
            }
        });
        return deferred.promise;
    }
    
    function findEventById(eventId) {
        var deferred = q.defer();
        EventModel.findById(eventId, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(event);
            }
        });
        return deferred.promise;
    }
    
    function updateEvent(eventId, event) {
        var deferred = q.defer();
        EventModel.update(
            { _id:eventId },

                // name: website.name,
                // description: website.description
                event
            , function (err, event) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(event);
                }
            });
        return deferred.promise;
    }
    
    function deleteEvent(eventId) {
        var deferred = q.defer();
        EventModel.findByIdAndRemove({_id: eventId}, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else {
                event.remove();
                deferred.resolve(event);
            }
        });
        return deferred.promise;
    }
    
    function addService(eventId, serviceId) {
        var deferred = q.defer();
        EventModel.findById(eventId, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else {
                event.services.push(serviceId);
                event.save();
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function addProduct(eventId, productId) {
        var deferred = q.defer();
        EventModel.findById(eventId, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else {
                event.products.push(productId);
                event.save();
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

};