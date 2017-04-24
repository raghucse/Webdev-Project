module.exports = function (mongoose, q) {

    var EventSchema = require('./event.schema.server')(mongoose);
    var EventModel = mongoose.model('EventModel', EventSchema);

    var api = {
        "createEventForUser": createEventForUser,
        "findAllEventsForUser": findAllEventsForUser,
        "findAllGuestsForEvent" : findAllGuestsForEvent,
        "findAllProductsForEvent" : findAllProductsForEvent,
        "findAllOrdersForEvent" : findAllOrdersForEvent,
        "findEventById": findEventById,
        "updateEvent": updateEvent,
        "deleteEvent": deleteEvent,
        "addGuest": addGuest,
        "addOrder": addOrder,
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

    function findAllGuestsForEvent(eventId) {
        var deferred = q.defer();
        EventModel.find({_id: eventId}, function (err, guests) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(guests);
            }
        });
        return deferred.promise;
    }

    function findAllProductsForEvent(eventId) {
        var deferred = q.defer();
        EventModel.find({_id: eventId}, function (err, products) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(products);
            }
        });
        return deferred.promise;
    }

    function findAllOrdersForEvent(eventId) {
        var deferred = q.defer();
        EventModel.find({_id: eventId}, function (err, orders) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(orders);
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
        EventModel.update({ _id:eventId },event
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

    function addGuest(eventId, guestId) {
        var deferred = q.defer();
        EventModel.findById(eventId, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else {
                event.guests.push(guestId);
                event.save();
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function addOrder(eventId, orderId) {
        var deferred = q.defer();
        EventModel.findById(eventId, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else {
                event.orders.push(orderId);
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