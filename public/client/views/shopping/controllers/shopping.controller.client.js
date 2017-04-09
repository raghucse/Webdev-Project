/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("ShoppingListController", ShoppingListController);
    app.controller("SearchShoppingController", SearchShoppingController);
    app.controller("ShoppingGuestListController", ShoppingGuestListController);

    function ShoppingListController($routeParams, ShoppingService) {
        var vm = this;
        vm.hostId = $routeParams["hid"];
        vm.eventId = $routeParams["eid"];

        function init() {
            ShoppingService
                .findAllItemsForEvent(vm.eventId )
                .then(function (services) {
                    vm.items = services.data;
                });
        }
        init();

        function updateItem(item) {

        }
    }

    function ShoppingGuestListController($routeParams, ShoppingService) {
        var vm = this;
        vm.eventId = $routeParams["eid"];

        function init() {
            ShoppingService
                .findAllItemsForEvent(vm.eventId )
                .then(function (services) {
                    vm.items = services.data;
                });
        }
        init();
    }

    function SearchShoppingController($routeParams, ShoppingService, $scope) {
        var vm = this;
        vm.hostId = $routeParams["hid"];
        vm.eventId = $routeParams["eid"];
        vm.searchItems = searchItems;
        vm.addItem = addItem;

        console.log(vm.hostId);
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
            ShoppingService.addItem(vm.hostId, item, vm.eventId).then(function (data) {
                item.added = true;
                //$scope.$apply();
            });


        }
    }

})();