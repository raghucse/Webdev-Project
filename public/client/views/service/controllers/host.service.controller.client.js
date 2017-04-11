
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("HostServiceListController", HostServiceListController);
    app.controller("HostServiceOrderController", HostServiceOrderController);

    function HostServiceListController($routeParams, EventService, ServiceService, VendorService, OrderService) {
        var vm = this;
        vm.eventID = $routeParams["eid"];
        vm.hostID = $routeParams["hid"];

        vm.findService = findService;

        function init() {
            EventService
                .findAllOrdersForEvent(vm.eventID)
                .then(function (event) {
                    var myevent = event.data;
                    var orderIDList = myevent[0].orders;
                    var serviceList = [];
                    var reqServicesList = [];
                    vm.penOrders = [];
                    vm.conOrders = [];
                    for(var i = 0; i < orderIDList.length ; i++){
                        (function (i) {
                            OrderService
                                .findOrderById(orderIDList[i])
                                .success(function (order) {
                                    var serviceid = order.service;
                                    if(!order.accepted){
                                        vm.penOrders.push(order);
                                    }
                                    else{
                                        vm.conOrders.push(order);
                                    }
                                    ServiceService
                                        .findServiceById(serviceid)
                                        .success(function (service) {

                                            serviceList.push(service.name);
                                        });
                                });
                        })(i);
                    }
                    vm.services = serviceList;
                    console.log(vm.penOrders);
                });
        }
        init();

        function findService(vendor, servicetype) {
            VendorService
                .findVendorByVendorname(vendor)
                .success(function (vendor) {
                    var vendorList = vendor;
                    var vendors = [];
                    for(var i = 0; i < vendorList.length ; i++){
                        var vendorname = {
                        };
                        vendorname["name"] = vendorList[i].vendorname;

                        ServiceService
                            .findAllServicesForVendor(vendorList[i]._id)
                            .success(function (services) {
                               vendorname["services"] = services;
                            });
                        vendors.push(vendorname);
                        }
                        vm.vendors = vendors;
                });
        }


    }

    function HostServiceOrderController($routeParams, ServiceService, OrderService, EventService) {
        var vm = this;
        vm.hostId = $routeParams["hid"];
        vm.eventId = $routeParams["eid"];
        vm.serviceId = $routeParams["sid"];

        vm.createOrder = createOrder;


        function init() {
            ServiceService
                .findServiceById(vm.serviceId)
                .then(function (service) {
                    vm.service = service.data;
                    vm.vendorId = vm.service._vendor;

                });
        }
        init();

        function createOrder(serviceId, platesrequested) {
            var order ={};
            order.platesrequested = platesrequested;
            order.cost = platesrequested * vm.service.perPlateCost;
            OrderService
                .createOrder(serviceId, vm.hostId, vm.vendorId, order)
                .success(function (order) {
                    ServiceService
                        .updateOrder(serviceId, order._id)
                        .success(function (service) {
                            EventService
                                .addOrder(vm.eventId, order._id)
                                .success(function (response) {
                                    vm.orderstatus = "Order Placed";
                                });
                        });
                })
        }
    }

})();