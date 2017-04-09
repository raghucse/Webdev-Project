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
    /*        "findAllItemsForHost": findAllItemsForHost,*/
            "findAllItemsForEvent": findAllItemsForEvent,
            "findItemsByItemId": findItemsByItemId,
            "updateItemQuantity": updateItemQuantity,
  /*          "findServiceById": findServiceById,
            "updateService": updateService,
            "deleteService": deleteService,
            "findAllServicesForVendor": findAllServicesForVendor,
            "updatePage": updatePage,*/
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

     /*   function findAllItemsForHost(hostId) {
            return $http.get("/api/host/"+hostId+"/shopping");
        }*/

        function findAllItemsForEvent(eventId) {
            return $http.get("/api/event/"+eventId+"/shopping");
        }

        function findItemsByItemId(itemId) {
            return $http.get("/api/shopping/"+itemId);
        }

        function updateItemQuantity(id, quantity) {
            console.log(id);
            console.log(quantity);
            return $http.put("/api/shopping/"+id+"/quantity/"+quantity);
        }

        /*

        function findServiceById(serviceId) {
            return $http.get("/api/service/"+serviceId);
        }

        function updateService(serviceId, service) {
            return $http.put("/api/service/"+serviceId, service);
        }

        function deleteService(serviceId) {
            return $http.delete("/api/service/"+serviceId);
        }

        function updatePage(serviceId, pageId) {
            return $http.put("/api/service/"+serviceId+"/page/"+pageId);
        }*/
    }

})();