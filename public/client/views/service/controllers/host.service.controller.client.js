
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("HostServiceListController", HostServiceListController);
    // app.controller("NewServiceController", NewServiceController);
    // app.controller("EditServiceController", EditServiceController);
    // app.controller("ServiceViewController", ServiceViewController);

    function HostServiceListController($routeParams, EventService, ServiceService, VendorService, OrderService) {
        var vm = this;

        function init() {
            vm.eventID = $routeParams["eid"];
            vm.hostID = $routeParams["hid"];

            vm.findService = findService;
            vm.createOrder = createOrder;

            // EventService
            //     .findAllServicesForEvent(vm.eventID)
            //     .then(function (event) {
            //         var serviceIDList = event[0].services;
            //         var serviceList = [];
            //         //console.log(guestIDList);
            //         for(var i = 0; i < serviceIDList.length ; i++){
            //             var serviceid = serviceIDList[i];
            //             ServiceService
            //                 .findServiceById(serviceid)
            //                 .success(function (service) {
            //                     serviceList.push(service.name);
            //                 })
            //         }
            //         vm.services = serviceList;
            //     });
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

        function createOrder() {
            OrderService
                .createOrder(serviceId, vm.hostID, vm.vendorID, order);

        }
    }

    // function ServiceViewController($routeParams, ServiceService) {
    //     var vm = this;
    //     vm.serviceId = $routeParams["sid"];
    //     vm.vendorId = $routeParams["vid"];
    //
    //     console.log(vm.serviceId);
    //     function init() {
    //         ServiceService
    //             .findServiceById(vm.serviceId)
    //             .then(function (service) {
    //                 console.log(vm.service);
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
    // }
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