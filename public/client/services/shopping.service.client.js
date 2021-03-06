/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("ShoppingService", ShoppingService);

    function ShoppingService($http) {
        var api = {
            "addItem": addItem,
            "findAllItemsForEvent": findAllItemsForEvent,
            "findItemsByItemId": findItemsByItemId,
            "updateItemQuantity": updateItemQuantity,
            "deleteItem": deleteItem,
            "claimItem": claimItem,
            "findItemById": findItemById,
            "searchItem": searchItem
        };
        return api;

        function searchItem(query) {
            var urlBase = "https://api.walmartlabs.com/v1/search?apiKey=cpdgmcduc6zz85n7zau6f5zz&query=API_QUERY";
            var url = urlBase.replace("API_QUERY", query);
            return $.ajax({
                url: url,
                dataType: 'jsonp',
                type: "GET",
                error: function (e) {
                    console.dir(e);
                }
            }).then(function (resp) {
                return resp;
            });
        }

        function addItem(hostId, item, eventId) {
            return $http.post("/api/host/"+hostId+"/event/"+eventId+"/shopping/add", item);
        }

        function findAllItemsForEvent(eventId) {
            return $http.get("/api/event/"+eventId+"/shopping");
        }

        function findItemById(id) {
            return $http.get("/api/shopping/"+id);
        }

        function findItemsByItemId(itemId, hostId) {
            return $http.get("/api/host/"+hostId+"/shopping/"+itemId);
        }

        function updateItemQuantity(id, quantity) {
            return $http.put("/api/shopping/"+id+"/quantity/"+quantity);
        }

        function deleteItem(id) {
            return $http.delete("/api/shopping/delete/"+id);
        }

        function claimItem(guestId, id, guest) {
            return $http.put("/api/guest/"+guestId+"/shopping/"+id, guest);
        }
    }

})();