
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("ServiceListController", ServiceListController);
    app.controller("NewServiceController", NewServiceController);
    app.controller("EditServiceController", EditServiceController);
    app.controller("ServiceViewController", ServiceViewController);

    function ServiceListController($routeParams, ServiceService, OrderService) {
        var vm = this;

        vm.vendorId = $routeParams["vid"];

        vm.acceptOrder = acceptOrder;

        function init() {
            OrderService
                .findAllOrdersForVendor(vm.vendorId)
                .then(function (orders) {
                    var myOrders = [];
                    var myCurrOrders = [];
                    var orderlist = orders.data;
                    for(var i = 0; i < orderlist.length ; i++){
                        if(!orderlist[i].accepted){
                            myOrders.push(orderlist[i]);
                        }
                        else{
                            myCurrOrders.push(orderlist[i]);
                        }
                    }
                    vm.orders = myOrders;
                    vm.currOrders = myCurrOrders;
                });
            ServiceService
                .findAllServicesForVendor(vm.vendorId)
                .then(function (services) {
                    vm.services = services.data;
                });
        }
        init();

        function acceptOrder(order) {
            order.accepted = true;
            OrderService
                .updateOrder(order._id, order)
                .success(function (order) {
                })
        }
    }

    function ServiceViewController($routeParams, ServiceService) {
        var vm = this;
        vm.serviceId = $routeParams["sid"];
        vm.vendorId = $routeParams["vid"];

        console.log(vm.serviceId);
        function init() {
            ServiceService
                .findServiceById(vm.serviceId)
                .then(function (service) {
                    console.log(vm.service);
                    vm.service = service.data;
                    if(vm.service.type == 'place'){
                        vm.place = true;
                        vm.food = false;
                        vm.flower = false;
                    }
                    else if(vm.service.type == 'food'){
                        vm.food = true;
                    }
                    else if(vm.service.type == 'flower'){
                        vm.flower = true;
                    }
                });
        }
        init();
    }


    function NewServiceController($routeParams, ServiceService, $location, VendorService) {
        var vm = this;
        vm.vendorId = $routeParams["vid"];
        vm.createService = createService;
        vm.dropChange = dropChange;

        function init() {
            ServiceService
                .findAllServicesForVendor(vm.vendorId)
                .then(function (services) {
                    vm.services = services.data;
                });
        }
        init();

        function dropChange() {
            if(vm.service.type == 'place'){
                vm.place = true;
                vm.food = false;
                vm.flower = false;
            }
            else if(vm.service.type == 'food'){
                vm.place = false;
                vm.food = true;
                vm.flower = false;
            }
            else if(vm.service.type == 'flower'){
                vm.place = false;
                vm.food = false;
                vm.flower = true;
            }
        }

        function createService() {
            console.log(vm.service);
            ServiceService
                .createService(vm.vendorId, vm.service)
                .then(function (service) {
                    vm.service = service.data;
                    VendorService.updateService(vm.vendorId, vm.service._id)
                        .then(function (status) {
                            $location.url("/vendor/"+vm.vendorId+"/service");
                        })
                });
        }
    }

    function EditServiceController($routeParams, ServiceService, $location) {
        var vm = this;
        vm.vendorId = $routeParams["vid"];
        vm.serviceId = $routeParams["sid"];
        vm.deleteService = deleteService;
        vm.updateService = updateService;

        function init() {
            ServiceService
                .findAllServicesForVendor(vm.vendorId)
                .then(function (services) {
                    vm.services = services.data;
                });

            ServiceService
                .findServiceById(vm.serviceId)
                .then(function (service) {
                            vm.service = service.data;
                    if(vm.service.type == 'food' || vm.service.type == 'place'){
                        vm.palceOrFood = true;
                    }
                    else {
                        vm.palceOrFood = false;
                    }
                });
        }
        init();

        function deleteService() {
            ServiceService
                .deleteService(vm.serviceId)
                .then(function () {
                    $location.url("/vendor/"+vm.vendorId+"/service");
                });
        }

        function updateService() {
            ServiceService
                .updateService(vm.serviceId, vm.service)
                .then(function (service) {
                    vm.service = service.data;
                    $location.url("/vendor/"+vm.vendorId+"/service");
                });
        }
    }


})();