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
            "addGuest": addGuest,
            "addOrder": addOrder,
            "addProduct": addProduct,
            "findAllGuestsForEvent" : findAllGuestsForEvent,
            "findAllProductsForEvent" : findAllProductsForEvent,
            "findAllOrdersForEvent" : findAllOrdersForEvent
        };

        return api;

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
            return $http.put("/api/event/" + eventId, event);
        }

        function deleteEvent(eventID) {
            return $http.delete("/api/event/" + eventID);
        }

        function addGuest(eventId, guestId) {
            return $http.put("/api/event/"+eventId+"/guest/"+guestId);
        }
        
        function addOrder(eventId, orderId) {
            return $http.put("/api/event/"+eventId+"/order/"+orderId);
        }

        function addProduct(eventId, productId) {
            return $http.put("/api/event/"+eventId+"/product/"+productId);
        }

        function findAllGuestsForEvent(eventId) {
            return $http.get("/api/guest/event/guests/" + eventId );
        }

        function findAllProductsForEvent(eventId) {
            return $http.get("/api/guest/event/products/" + eventId );
        }

        function findAllOrdersForEvent(eventId) {
            return $http.get("/api/guest/event/orders/" + eventId);
        }
    }

})();