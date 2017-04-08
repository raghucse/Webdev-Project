/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("ShoppingListController", ShoppingListController);
    app.controller("NewShoppingController", NewShoppingController);
    app.controller("SearchShoppingController", SearchShoppingController);

    function ShoppingListController($routeParams, ShoppingService) {
        var vm = this;
        vm.userId = $routeParams["uid"];

        function init() {
            ShoppingService
                .findAllItemsForuser(vm.userId )
                .then(function (services) {
                    vm.items = services.data;
                });
        }
        init();
    }

    function SearchShoppingController($routeParams, ShoppingService, $scope) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.searchItems = searchItems;
        vm.addItem = addItem;


        console.log(vm.userId);
        function init() {
        }
        init();

        function searchItems() {
            ShoppingService.searchItem(vm.searchQuery).then(function (data) {
                vm.items = data.items;
                $scope.$apply();
            });
        }

        function addItem(item) {
            item.added = true;
            ShoppingService.addItem(vm.userId, item).then(function (data) {
                item.added = true;
                //$scope.$apply();
            });


        }
    }


    function NewShoppingController($routeParams, ServiceService, $location, VendorService) {
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
            if(vm.service.type == 'food' || vm.service.type == 'place'){
                vm.palceOrFood = true;
            }
            else {
                vm.palceOrFood = false;
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