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
        vm.deleteItem = deleteItem;

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

        function deleteItem(item) {
            ShoppingService.deleteItem(item._id)
                .then(function (status) {
                    var index = vm.items.indexOf(item);
                    vm.items.splice(index,1);
                    vm.deleteSucces = "Item deleted from the list";
                },function (err) {
                    vm.deleteError = "Unable to delete item from list";
                })
        }
    }

    function ShoppingGuestListController($routeParams, ShoppingService, $scope) {
        var vm = this;
        vm.eventId = $routeParams["eid"];
        vm.guestId = $routeParams["gid"];
        vm.checkGuest = checkGuest;
        vm.claimItem = claimItem;
        vm.unclaimItem = unclaimItem;
        vm.claimedItems = [];
        vm.unClaimedItems = [];
        vm.items = [];

        function init() {
            ShoppingService
                .findAllItemsForEvent(vm.eventId )
                .then(function (services) {
                    vm.items = services.data;
                    for(var i in vm.items){
                        if(vm.items[i]._guest){
                            vm.claimedItems.push(vm.items[i]);
                        }
                        else{
                            vm.unClaimedItems.push(vm.items[i]);
                        }
                    }
                });
        }
        init();

        function claimItem(item) {
            ShoppingService
                .claimItem(vm.guestId,item._id)
                .then(function (item) {
                    item = item.data;
                     if(item._guest == vm.guestId) {
                         var index = vm.unClaimedItems.indexOf(item);
                         vm.unClaimedItems.splice(index, 1);
                         vm.claimedItems.push(item);
                         vm.claimSuccess = "Item claimed successfully";
                     }
                     else {
                         console.log(item._guest);
                         vm.claimError = "Item could not be claimed";
                     }
                }, function (err) {
                    console.log(err);
                    vm.claimError = "Item could not be claimed";
                })
        }

        function unclaimItem(item) {
            ShoppingService
                .claimItem("unClaim",item._id)
                .then(function (item) {
                    item = item.data;
                    console.log(item);
                    if(!item._guest) {
                        var index = vm.claimedItems.indexOf(item);
                        vm.claimedItems.splice(index, 1);
                        vm.unClaimedItems.push(item);
                        vm.unClaimSuccess = "Item unclaimed successfully";
                    }
                }, function (err) {
                    console.log(err);
                    vm.unClaimError = "Item could not be unclaimed";
                })
        }

        function checkGuest(guestId) {
            if(guestId === vm.guestId) {
                console.log("cheked");
                return true;
            }
        }

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