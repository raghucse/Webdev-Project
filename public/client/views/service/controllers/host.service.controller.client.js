
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
        vm.refreshData = refreshData;
        vm.searchServiceByType = searchServiceByType;

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
            vm.services = undefined;
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

        function refreshData() {
            init();
        }

        function findServiceByCity(cityname) {
            vm.vendor = undefined;
            vm.services = undefined;
            if(cityname != ""){
                cityname = angular.lowercase(cityname);

                ServiceService
                    .findAllServicesInCity(cityname)
                    .success(function (services) {
                        if(services){
                            vm.services = services;
                            }
                    });
            }
        }

        function searchServiceByType(serviceType, serviceCity) {
            vm.servicesByType = undefined;

            if(serviceType != "" && serviceCity != ""){
                serviceCity = angular.lowercase(serviceCity);

                ServiceService
                    .findAllServicesInCity(serviceCity)
                    .success(function (services) {
                        if(services){
                            var serviceList = []
                            for(var i = 0; i < services.length ; i++){
                                if(services[i].type == serviceType){
                                    serviceList.push(services[i]);
                                }
                            }
                            vm.servicesByType = serviceList;
                        }
                    });
            }
        }


        function cancelOrder(order) {
            var newOrder = {};
            newOrder._id = order._id;
            newOrder.cancelled = true;
            OrderService
                .updateOrder(order._id, newOrder)
                .success(function (response) {
                    init();
                })
        }


    }

    function HostServiceOrderController($routeParams, ServiceService, OrderService, EventService, $location) {
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
                                    $location.url("/host/" + vm.hostId + "/event/" + vm.eventId + "/services");
                                });
                        });
                })
        }
    }

})();