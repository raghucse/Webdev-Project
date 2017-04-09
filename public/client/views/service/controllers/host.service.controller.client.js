
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("HostServiceListController", HostServiceListController);
    app.controller("HostServiceOrderController", HostServiceOrderController);
    // app.controller("EditServiceController", EditServiceController);
    // app.controller("ServiceViewController", ServiceViewController);

    function HostServiceListController($routeParams, EventService, ServiceService, VendorService, OrderService) {
        var vm = this;

        vm.findService = findService;


        function init() {
            vm.eventID = $routeParams["eid"];
            vm.hostID = $routeParams["hid"];


            EventService
                .findAllServicesForEvent(vm.eventID)
                .then(function (event) {
                    var myevent = event.data;
                    var serviceIDList = myevent[0].services;
                    var serviceList = [];
                    var reqServicesList = [];

                    for(var i = 0; i < serviceIDList.length ; i++){
                        var serviceid = serviceIDList[i];
                        ServiceService
                            .findServiceById(serviceid)
                            .success(function (service) {
                                serviceList.push(service.name);
                            });
                        OrderService
                            .findAllOrdersForService(serviceid)
                            .success(function (orders) {
                                var myPenOrders = [];
                                var myConOrders = [];
                                var orderlist = orders;
                                for(var i = 0; i < orderlist.length ; i++){
                                    if(!orderlist[i].accepted){
                                        myPenOrders.push(orderlist[i]);
                                    }
                                    else{
                                        myConOrders.push(orderlist[i]);
                                    }
                                }
                                vm.penOrders = myPenOrders;
                                vm.conOrders = myConOrders;

                            });
                    }
                    vm.services = serviceList;

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

        function createOrder(serviceId) {
            var order ={};
            OrderService
                .createOrder(serviceId, vm.hostId, vm.vendorId, order)
                .success(function (order) {
                    ServiceService
                        .updateOrder(serviceId, order._id)
                        .success(function (service) {
                            EventService
                                .addService(vm.eventId, serviceId)
                                .success(function (response) {
                                    vm.orderstatus = "Order Placed";
                                });
                        });
                })

        }





    }
    //
    //
    // function NewServiceController($routeParams, ServiceService, $location, VendorService) {
    //     var vm = this;
    //     vm.vendorId = $routeParams["vid"];
    //     vm.createService = createService;
    //     vm.dropChange = dropChange;
    //
    //     function init() {
    //         ServiceService
    //             .findAllServicesForVendor(vm.vendorId)
    //             .then(function (services) {
    //                 vm.services = services.data;
    //             });
    //     }
    //     init();
    //
    //     function dropChange() {
    //         if(vm.service.type == 'food' || vm.service.type == 'place'){
    //             vm.palceOrFood = true;
    //         }
    //         else {
    //             vm.palceOrFood = false;
    //         }
    //     }
    //
    //     function createService() {
    //         console.log(vm.service);
    //         ServiceService
    //             .createService(vm.vendorId, vm.service)
    //             .then(function (service) {
    //                 vm.service = service.data;
    //                 VendorService.updateService(vm.vendorId, vm.service._id)
    //                     .then(function (status) {
    //                         $location.url("/vendor/"+vm.vendorId+"/service");
    //                     })
    //             });
    //     }
    // }
    //
    // function EditServiceController($routeParams, ServiceService, $location) {
    //     var vm = this;
    //     vm.vendorId = $routeParams["vid"];
    //     vm.serviceId = $routeParams["sid"];
    //     vm.deleteService = deleteService;
    //     vm.updateService = updateService;
    //
    //     function init() {
    //         ServiceService
    //             .findAllServicesForVendor(vm.vendorId)
    //             .then(function (services) {
    //                 vm.services = services.data;
    //             });
    //
    //         ServiceService
    //             .findServiceById(vm.serviceId)
    //             .then(function (service) {
    //                 vm.service = service.data;
    //                 if(vm.service.type == 'food' || vm.service.type == 'place'){
    //                     vm.palceOrFood = true;
    //                 }
    //                 else {
    //                     vm.palceOrFood = false;
    //                 }
    //             });
    //     }
    //     init();
    //
    //     function deleteService() {
    //         ServiceService
    //             .deleteService(vm.serviceId)
    //             .then(function () {
    //                 $location.url("/vendor/"+vm.vendorId+"/service");
    //             });
    //     }
    //
    //     function updateService() {
    //         ServiceService
    //             .updateService(vm.serviceId, vm.service)
    //             .then(function (service) {
    //                 vm.service = service.data;
    //                 $location.url("/vendor/"+vm.vendorId+"/service");
    //             });
    //     }
    // }
    //

})();