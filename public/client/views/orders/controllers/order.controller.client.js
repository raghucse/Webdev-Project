/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("OrderListController", OrderListController);
    app.controller("NewOrderController", NewOrderController);
    app.controller("EditOrderController", EditOrderController);
    app.controller("OrderViewController", OrderViewController);

    function OrderListController($routeParams, OrderOrder) {
        var vm = this;
        vm.serviceId = $routeParams["sid"];

        function init() {
            OrderOrder
                .findAllOrdersForService(vm.serviceId)
                .then(function (orders) {
                    vm.orders = orders.data;
                });
        }
        init();
    }

    function OrderViewController($routeParams, OrderOrder) {
        var vm = this;
        vm.orderId = $routeParams["sid"];
        vm.serviceId = $routeParams["vid"];

        console.log(vm.orderId);
        function init() {
            OrderOrder
                .findOrderById(vm.orderId)
                .then(function (order) {
                    console.log(vm.order);
                    vm.order = order.data;
                    if(vm.order.type == 'food' || vm.order.type == 'place'){
                        vm.palceOrFood = true;
                    }
                    else {
                        vm.palceOrFood = false;
                    }
                });
        }
        init();
    }


    function NewOrderController($routeParams, OrderOrder, $location, ServiceOrder) {
        var vm = this;
        vm.serviceId = $routeParams["vid"];
        vm.createOrder = createOrder;
        vm.dropChange = dropChange;

        function init() {
            OrderOrder
                .findAllOrdersForService(vm.serviceId)
                .then(function (orders) {
                    vm.orders = orders.data;
                });
        }
        init();

        function dropChange() {
            if(vm.order.type == 'food' || vm.order.type == 'place'){
                vm.palceOrFood = true;
            }
            else {
                vm.palceOrFood = false;
            }
        }

        function createOrder() {
            console.log(vm.order);
            OrderOrder
                .createOrder(vm.serviceId, vm.order)
                .then(function (order) {
                    vm.order = order.data;
                    ServiceOrder.updateOrder(vm.serviceId, vm.order._id)
                        .then(function (status) {
                            $location.url("/service/"+vm.serviceId+"/order");
                        })
                });
        }
    }

    function EditOrderController($routeParams, OrderOrder, $location) {
        var vm = this;
        vm.serviceId = $routeParams["vid"];
        vm.orderId = $routeParams["sid"];
        vm.deleteOrder = deleteOrder;
        vm.updateOrder = updateOrder;

        function init() {
            OrderOrder
                .findAllOrdersForService(vm.serviceId)
                .then(function (orders) {
                    vm.orders = orders.data;
                });

            OrderOrder
                .findOrderById(vm.orderId)
                .then(function (order) {
                    vm.order = order.data;
                    if(vm.order.type == 'food' || vm.order.type == 'place'){
                        vm.palceOrFood = true;
                    }
                    else {
                        vm.palceOrFood = false;
                    }
                });
        }
        init();

        function deleteOrder() {
            OrderOrder
                .deleteOrder(vm.orderId)
                .then(function () {
                    $location.url("/service/"+vm.serviceId+"/order");
                });
        }

        function updateOrder() {
            OrderOrder
                .updateOrder(vm.orderId, vm.order)
                .then(function (order) {
                    vm.order = order.data;
                    $location.url("/service/"+vm.serviceId+"/order");
                });
        }
    }


})();