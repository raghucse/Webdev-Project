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
        vm.updateItem = updateItem;

        function init() {
            ShoppingService
                .findAllItemsForEvent(vm.eventId )
                .then(function (services) {
                    vm.items = services.data;
                });
        }
        init();

        function updateItem(item) {
            ShoppingService.updateItemQuantity(item._id, item.quantity)
                .then(function (item) {
                    vm.addSucces = "Item updated successfully";
                },function (err) {
                    vm.addError = "Error while updating item";
                })
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

            ShoppingService.findItemsByItemId(item.itemId, vm.hostId)
                .then(function (data) {
                    var itemFromDb = data.data;
                    if(itemFromDb){
                        var newQuantity = itemFromDb.quantity + parseInt(item.quantity);
                        ShoppingService.updateItemQuantity(itemFromDb._id, newQuantity)
                            .then(function (item) {
                                vm.addSucces = "Item added successfully";
                            },function (err) {
                                vm.addError = "Error while adding item";
                            })
                    }
                    else
                    {
                        ShoppingService.addItem(vm.hostId, item, vm.eventId).then(function (data) {
                            vm.addSucces = "Item added successfully";
                        },function (err) {
                            vm.addError = "Error while adding item";
                        });
                    }
                });




        }
    }

})();