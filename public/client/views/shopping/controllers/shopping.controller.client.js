/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("ShoppingListController", ShoppingListController);
    app.controller("SearchShoppingController", SearchShoppingController);
    app.controller("ShoppingGuestListController", ShoppingGuestListController);

    function ShoppingListController($routeParams, ShoppingService, UserService, $rootScope, $location) {
        var vm = this;
        vm.hostId = $routeParams["hid"];
        vm.eventId = $routeParams["eid"];
        vm.claimedItems = [];
        vm.unClaimedItems = [];

        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem;
        vm.intializeMessages = intializeMessages;
        vm.unclaimItem = unclaimItem;
        vm.claimItem = claimItem;
        vm.checkGuest = checkGuest;
        vm.logout = logout;


        function init() {
            ShoppingService
                .findAllItemsForEvent(vm.eventId)
                .then(function (services) {
                    vm.claimedItems = [];
                    vm.unClaimedItems = [];
                    vm.items = services.data;
                    for (var i in vm.items) {
                        if (vm.items[i]._guest) {
                            if (vm.items[i]._guest == vm.hostId) {
                                vm.items[i].name = "you"
                            }
                            else {
                                //vm.items[i].name = vm.items[i].guest.firstName+" "+vm.items[i].guest.lastName;
                                vm.items[i].name = vm.items[i].guest.username;
                            }
                            vm.claimedItems.push(vm.items[i]);
                        }
                        else {
                            vm.unClaimedItems.push(vm.items[i]);
                        }
                    }
                });

            UserService.findUserById(vm.hostId)
                .then(function (host) {
                    vm.host = host.data;
                })
        }

        init();

        function logout() {
            UserService
                .logout()
                .then(function(response) {
                    $rootScope.currentUser = null;
                    $location.url("/home");
                });
        }


        function updateItem(item) {
            ShoppingService.updateItemQuantity(item._id, item.quantity)
                .then(function (item) {
                    vm.addSucces = "Item updated successfully";
                }, function (err) {
                    vm.addError = "Error while updating item";
                })
        }

        function deleteItem(item) {
            ShoppingService.deleteItem(item._id)
                .then(function (status) {
                    var index = vm.claimedItems.indexOf(item);
                    vm.claimedItems.splice(index, 1);

                    var index2 = vm.unClaimedItems.indexOf(item);
                    vm.unClaimedItems.splice(index2, 1);

                    vm.deleteSucces = "Item deleted from the list";
                }, function (err) {
                    vm.deleteError = "Unable to delete item from list";
                })
        }

        function intializeMessages() {
            init();
            vm.unClaimSuccess = undefined;
            vm.unClaimError = undefined;
            vm.claimSuccess = undefined;
            vm.claimError = undefined;
            vm.claimErrorOther = undefined;
        }

        function claimItem(item) {
            ShoppingService.findItemById(item._id)
                .then(function (dItem) {
                    dItem = dItem.data;
                    if (!dItem._guest) {
                        ShoppingService
                            .claimItem(vm.hostId, item._id, vm.host)
                            .then(function (item) {
                                item = item.data;
                                if (item._guest == vm.hostId) {
                                    var index = 0;
                                    for (index = 0; index < vm.unClaimedItems.length; index++) {
                                        if (vm.unClaimedItems[index].itemId == item.itemId) {
                                            break;
                                        }
                                    }
                                    vm.unClaimedItems.splice(index, 1);
                                    vm.claimedItems.push(item);
                                    vm.claimSuccess = "Item claimed successfully";
                                }
                                else {
                                    vm.claimError = "Item could not be claimed";
                                }
                            }, function (err) {
                                vm.claimError = "Item could not be claimed";
                            })
                    }
                    else {
                        init();
                        vm.claimErrorOther = "Item already claimed by other guest";
                    }
                })
        }

        function unclaimItem(item) {
            ShoppingService
                .claimItem("unClaim",item._id, null)
                .then(function (item) {
                    item = item.data;
                    if(!item._guest) {
                        for(index = 0; index < vm.claimedItems.length ; index++ ){
                            if(vm.claimedItems[index].itemId == item.itemId){
                                break;
                            }
                        }

                        vm.claimedItems.splice(index, 1);
                        vm.unClaimedItems.push(item);
                        vm.unClaimSuccess = "Item unclaimed successfully";
                    }
                }, function (err) {
                    vm.unClaimError = "Item could not be unclaimed";
                })
        }

        function checkGuest(guestId) {
            if(guestId == vm.hostId) {
                return true;
            }
        }
    }

    function ShoppingGuestListController($routeParams, ShoppingService, $scope, UserService, $rootScope, $location) {
        var vm = this;
        vm.eventId = $routeParams["eid"];
        vm.guestId = $routeParams["gid"];
        vm.claimedItems = [];
        vm.unClaimedItems = [];
        vm.items = [];

        vm.checkGuest = checkGuest;
        vm.claimItem = claimItem;
        vm.unclaimItem = unclaimItem;
        vm.intializeMessages = intializeMessages;
        vm.logout = logout;



        function init() {
            ShoppingService
                .findAllItemsForEvent(vm.eventId )
                .then(function (services) {
                    vm.claimedItems = [];
                    vm.unClaimedItems = [];
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

            UserService.findUserById(vm.guestId)
                .then(function (guest) {
                    vm.guest = guest.data;
                })
        }
        init();

        function claimItem(item) {

            ShoppingService.findItemById(item._id)
                .then(function (dItem) {
                    dItem = dItem.data;
                    if(!dItem._guest){
                        ShoppingService
                            .claimItem(vm.guestId,item._id, vm.guest)
                            .then(function (item) {
                                item = item.data;
                                if(item._guest == vm.guestId) {
                                    var index = 0;
                                    for(index = 0; index < vm.unClaimedItems.length ; index++ ){
                                        if(vm.unClaimedItems[index].itemId == item.itemId){
                                            break;
                                        }
                                    }
                                    vm.unClaimedItems.splice(index, 1);
                                    vm.claimedItems.push(item);
                                    vm.claimSuccess = "Item claimed successfully";
                                }
                                else {
                                    vm.claimError = "Item could not be claimed";
                                }
                            }, function (err) {
                                vm.claimError = "Item could not be claimed";
                            })
                    }
                    else {
                        init();
                        vm.claimErrorOther = "Item already claimed by other guest";
                    }
                })


        }

        function unclaimItem(item) {
            ShoppingService
                .claimItem("unClaim",item._id, null)
                .then(function (item) {
                    item = item.data;
                    if(!item._guest) {
                        for(index = 0; index < vm.claimedItems.length ; index++ ){
                            if(vm.claimedItems[index].itemId == item.itemId){
                                break;
                            }
                        }

                        vm.claimedItems.splice(index, 1);
                        vm.unClaimedItems.push(item);
                        vm.unClaimSuccess = "Item unclaimed successfully";
                    }
                }, function (err) {
                    vm.unClaimError = "Item could not be unclaimed";
                })
        }

        function checkGuest(guestId) {
            if(guestId === vm.guestId) {
                return true;
            }
        }

        function logout() {
            $('#myNavbar').collapse('hide');
            UserService
                .logout()
                .then(function(response) {
                    $rootScope.currentUser = null;
                    $location.url("/home");
                });
        }

        function intializeMessages() {

            init();
            vm.unClaimSuccess = undefined;
            vm.unClaimError = undefined;
            vm.claimSuccess = undefined;
            vm.claimError = undefined;
            vm.claimErrorOther = undefined;
        }

    }

    function SearchShoppingController($routeParams, ShoppingService, $scope, EventService, UserService, $rootScope
                                        ,$location) {
        var vm = this;
        vm.hostId = $routeParams["hid"];
        vm.eventId = $routeParams["eid"];

        vm.searchItems = searchItems;
        vm.addItem = addItem;
        vm.logout = logout;


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
                        ShoppingService.addItem(vm.hostId, item, vm.eventId).then(function (item) {
                            item = item.data;
                            EventService.addProduct(vm.eventId, item._id)
                                .then(function (status) {
                                    vm.addSucces = "Item added successfully";
                                })
                        },function (err) {
                            vm.addError = "Error while adding item";
                        });
                    }
                });

        }

        function logout() {
            UserService
                .logout()
                .then(function(response) {
                    $rootScope.currentUser = null;
                    $location.url("/home");
                });
        }

    }

})();