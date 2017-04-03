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
    
    function createEventForUser() {
        
    }
    
    function findAllEventsForUser() {
        
    }
    
    function findEventById() {
        
    }
    
    function updateEvent() {
        
    }
    
    function deleteEvent() {
        
    }
    
    function addService() {
        
    }

    function addProduct() {
        
    }

};