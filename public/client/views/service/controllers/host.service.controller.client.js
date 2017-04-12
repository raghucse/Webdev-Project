
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
        vm.cancelOrder = cancelOrder;
        vm.findServiceByCity = findServiceByCity;

        function init() {
            vm.vendor = "";
            vm.location= "";
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
                                    VendorService
                                        .findVendorById(order.vendor)
                                        .success(function (vendor) {
                                            order.vendor = vendor.vendorname;
                                        });
                                    ServiceService
                                        .findServiceById(serviceid)
                                        .success(function (service) {
                                            if(!order.cancelled)
                                            {
                                                serviceList.push(service.name);
                                            }
                                            order.type = service.type;
                                        });
                                    if(!order.accepted && !order.cancelled){

                                        vm.penOrders.push(order);
                                    }
                                    else if(!order.cancelled){
                                        vm.conOrders.push(order);
                                    }
                                });
                        })(i);
                    }
                    vm.services = serviceList;
                });
        }
        init();

        function findService(vendor) {
            vm.vendors= undefined;
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

        function findServiceByCity(cityname) {
            vm.vendors = undefined;
            if(cityname != ""){
                cityname = angular.lowercase(cityname);

                vm.vendors = undefined;
                VendorService
                    .findVendorByCity(cityname)
                    .success(function (vendors) {
                        if(vendors){
                            var vendorList = vendors;
                            var vendorsByCity = [];
                            for(var i = 0; i < vendorList.length ; i++){
                                (function (i){
                                    var vendor = {
                                    };
                                    vendor["name"] = vendorList[i].vendorname;
                                    ServiceService
                                        .findAllServicesForVendor(vendorList[i]._id)
                                        .success(function (services) {
                                            vendor["services"] = services;
                                        });
                                    vendorsByCity.push(vendor);
                                })(i);
                            }
                            vm.vendors = vendorsByCity;
                        }

                    })
            }
        }


        function cancelOrder(order) {
            var newOrder = {};
            newOrder._id = order._id;
            newOrder.cancelled = true;
            OrderService
                .updateOrder(order._id, newOrder)
                .success(function (response) {
                    console.log("Order Cancelled");
                    init();
                })
        }


    }

    function HostServiceOrderController($routeParams, ServiceService, OrderService, EventService) {
        var vm = this;
        vm.hostId = $routeParams["hid"];
        vm.eventId = $routeParams["eid"];
        vm.serviceId = $routeParams["sid"];

        vm.createOrder = createOrder;


        function init() {
            $('#timepicker1').timepicker();

            ServiceService
                .findServiceById(vm.serviceId)
                .then(function (service) {
                    vm.service = service.data;
                    vm.vendorId = vm.service._vendor;
                });
        }
        init();

        function createOrder(serviceId, platesrequested) {
            console.log(vm.time);
            var order ={};
            order.platesrequested = platesrequested;
            order.cost = platesrequested * vm.service.perPlateCost;
            order.cancelled = false;
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