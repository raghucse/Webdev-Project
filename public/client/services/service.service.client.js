/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("ServiceService", ServiceService);

    function ServiceService($http) {
        var api = {
            "createService": createService,
            "findServiceById": findServiceById,
            "updateService": updateService,
            "deleteService": deleteService,
            "findAllServicesForVendor": findAllServicesForVendor,
            "updateOrder": updateOrder
        };
        return api;

        function createService(vendorId, service) {
            return $http.post("/api/vendor/"+vendorId+"/service", service);
        }

        function findAllServicesForVendor(vendorId) {
            return $http.get("/api/vendor/"+vendorId+"/service");
        }

        function findServiceById(serviceId) {
            return $http.get("/api/service/"+serviceId);
        }

        function updateService(serviceId, service) {
            return $http.put("/api/service/"+serviceId, service);
        }

        function deleteService(serviceId) {
            return $http.delete("/api/service/"+serviceId);
        }

        function updateOrder(serviceId, orderId) {
            return $http.put("/api/service/"+serviceId+"/order/"+orderId);
        }
    }

})();