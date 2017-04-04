(function () {
    angular
        .module("WebAppMaker")
        .factory("EventService", eventService);

    function eventService($http) {

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


        app.put("/api/event/:eventId", updateEvent);
        app.delete("/api/event/:eventId", deleteEvent);
        app.put("/api/event/:eventId/service/:serviceId", addService);
        app.put("/api/event/:eventId/product/:productId", addProduct);

        function createEventForUser(hostId, event) {
            return $http.post("/api/user/" + hostId + "/event", event);
        }

        function findAllEventsForUser(hostId) {
            return $http.get("/api/user/" + hostId + "/event");
        }

        function findEventById(eventId) {
            return $http.get("/api/event/" + eventId);
        }

        function updateEvent(eventId, event) {
            for(var w in websites){
                if(websites[w]._id == websiteId){
                    websites[w].name = website.name;
                    websites[w].description = website.description;
                    return websites[w];
                }
            }
            return null;
        }

        function deleteWebsite(websiteId) {
            for(var w in websites){
                if(websites[w]._id == websiteId){
                    websites.splice(w, 1);
                }
            }
        }

    }

})();