(function () {
    angular
        .module("WebAppMaker")
        .factory("OrderService", orderService);

    function orderService($http) {

        var api = {
            createOrder: createOrder,
            findAllOrdersForVendor: findAllOrdersForVendor,
            findAllOrdersForService: findAllOrdersForService,
            findOrderById: findOrderById,
            updateOrder: updateOrder,
            deleteOrder: deleteOrder
        };

        return api;

        function createOrder(serviceId, hostId, vendorId, order) {
            return $http.post("/api/order/" + serviceId + "/" + hostId + "/" + vendorId , order);
        }

        function findAllOrdersForVendor(vendorId) {
            return $http.get("/api/order/" + vendorId + "/order");
        }

        function findAllOrdersForService(serviceId) {
            return $http.get("/api/service/" + serviceId + "/order");
        }

        function findOrderById(orderId) {
            return $http.get("/api/order/" + orderId);
        }

        function updateOrder(orderId, order) {
            return $http.put("/api/order/"+ orderId, order);
        }

        function deleteOrder(orderId) {
            return $http.delete("/api/order/" + orderId);
        }

    }

})();