
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("HostServiceListController", HostServiceListController);
    app.controller("HostServiceOrderController", HostServiceOrderController);

    function HostServiceListController($routeParams, EventService, ServiceService, VendorService, OrderService, $location) {
        var vm = this;
        vm.eventID = $routeParams["eid"];
        vm.hostID = $routeParams["hid"];


        vm.findService = findService;
        vm.cancelOrder = cancelOrder;
        vm.findServiceByCity = findServiceByCity;
        vm.refreshData = refreshData;
        vm.searchServiceByType = searchServiceByType;
        vm.setServiceId = setServiceId;
        vm.createOrder = createOrder;
        vm.setShowService = setShowService;

        function init() {
            $('#timepicker3').timepicker();
            $(document).ready(function(){
                var date_input=$('input[name="deliveryDate"]'); //our date input has the name "date"
                var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
                var options={
                    format: 'mm/dd/yyyy',
                    container: container,
                    todayHighlight: true,
                    autoclose: true
                };
                date_input.datepicker(options);
            });

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
                                                serviceList.push(service);
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

        function setShowService(service) {
            vm.showService = service;
        }

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

        function setServiceId(serviceID) {
            vm.modalServiceID = serviceID;

            ServiceService
                .findServiceById(vm.modalServiceID)
                .then(function (service) {
                    vm.modalService = service.data;
                    if(vm.modalService.type == "food"){
                        vm.modalServicefood = true;
                    }
                    else{
                        vm.modalServicefood = false;
                    }

                });

        }

        function createOrder(serviceId, platesrequested, deliveryDate, deliveryTime) {

            if(deliveryDate && deliveryTime){
                var order ={};
                if(vm.modalService.type == "food" && platesrequested){
                    order.platesrequested = platesrequested;
                    order.cost = platesrequested * vm.modalService.perPlateCost;
                }

                    order.date = deliveryDate;
                    order.time = deliveryTime;
                    order.cancelled = false;
                    OrderService
                        .createOrder(serviceId, vm.hostID, vm.modalService._vendor, order)
                        .success(function (order) {
                            ServiceService
                                .updateOrder(serviceId, order._id)
                                .success(function (service) {
                                    EventService
                                        .addOrder(vm.eventID, order._id)
                                        .success(function (response) {
                                            vm.orderstatus = "Order Placed";
                                            $location.url("/host/" + vm.hostID + "/event/" + vm.eventID + "/services");
                                            $('#orderService').modal('hide');
                                        });
                                });
                        });

            }

        }

        function findServiceByCity(cityname) {
            vm.vendor = undefined;
            vm.servicesByCity = undefined;
            if(cityname != ""){
                cityname = angular.lowercase(cityname);

                ServiceService
                    .findAllServicesInCity(cityname)
                    .success(function (services) {
                        if(services){
                            vm.servicesByCity = services;
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
                    EventService
                        .findEventById(vm.eventID)
                        .success(function (myevent) {
                           var orders = myevent.orders;
                            for(var p in orders){
                                if(orders[p] == order._id){
                                    orders.splice(p, 1);
                                }
                            }
                            myevent.orders = orders;
                            EventService
                                .updateEvent(vm.eventID, myevent)
                                .success(function (response) {
                                    init();
                                })

                        });
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
            $('#timepicker3').timepicker();

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