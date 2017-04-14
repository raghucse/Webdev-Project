(function () {
    angular
        .module("WebAppMaker")
        .config(configuration)
        .config(['$locationProvider', function($locationProvider) {
            $locationProvider.hashPrefix('');
        }]);

    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/host/:hid/event/profile",{
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event",{
                templateUrl: "views/event/templates/event-list.view.client.html",
                controller: "EventListController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/home",{
                templateUrl: "views/event/templates/event-list.view.client.html",
                controller: "EventListController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/new",{
                templateUrl: "views/event/templates/event-new.view.client.html",
                controller: "EventNewController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/invites",{
                templateUrl: "views/event/templates/event-invites.view.client.html",
                controller: "EventInviteController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/:eid",{
                templateUrl: "views/event/templates/event-edit.view.client.html",
                controller: "EventEditController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/:eid/home",{
                templateUrl: "views/event/templates/event-home.view.client.html",
                controller: "EventHomeController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/:eid/guests",{
                templateUrl: "views/event/templates/event-guests.view.client.html",
                controller: "EventGuestController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/:eid/services", {
                templateUrl: "views/service/templates/host/service-list.view.client.html",
                controller: "HostServiceListController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/host/:hid/event/:eid/services/:sid", {
                templateUrl: "views/service/templates/host/service-order.view.client.html",
                controller: "HostServiceOrderController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/guest/:gid/event/:eid/",{
                templateUrl: "views/event/templates/event-guest-home.view.client.html",
                controller: "GuestController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/vendor/:vid/service", {
                templateUrl: "views/service/templates/service-list.view.client.html",
                controller: "ServiceListController",
                controllerAs: "model",
                resolve: { loggedin: checkVendorLoggedin }
            })
            .when("/vendor/:vid/service/:sid/view", {
                templateUrl: "views/service/templates/service-view.client.html",
                controller: "ServiceViewController",
                controllerAs: "model",
                resolve: { loggedin: checkVendorLoggedin }
            })
            .when("/vendor/:vid/service/new", {
                templateUrl: "views/service/templates/service-new.view.client.html",
                controller: "NewServiceController",
                controllerAs: "model",
                resolve: { loggedin: checkVendorLoggedin }
            })
            .when("/vendor/:vid/service/:sid", {
                templateUrl: "views/service/templates/service-edit.view.client.html",
                controller: "EditServiceController",
                controllerAs: "model",
                resolve: { loggedin: checkVendorLoggedin }
            })
            .when("/host/:hid/event/:eid/shopping/search", {
                templateUrl: "views/shopping/templates/shoppingSearch.view.client.html",
                controller: "SearchShoppingController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
             })
            .when("/host/:hid/event/:eid/shopping", {
                templateUrl: "views/shopping/templates/shoppingList.view.client.html",
                controller: "ShoppingListController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/guest/:gid/event/:eid/shopping", {
                templateUrl: "views/shopping/templates/shoppingGuestList.view.client.html",
                controller: "ShoppingGuestListController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .when("/vendor/:vid/orders", {
                templateUrl: "views/orders/templates/order-list.view.client.html",
                controller: "OrderListController",
                controllerAs: "model",
                resolve: { loggedin: checkVendorLoggedin }
            })
            .when("/admin/:aid", {
                templateUrl: "views/user/templates/adminHome.view.client.html",
                controller: "AdminHomeController",
                controllerAs: "model",
                resolve: { loggedin: checkUserLoggedin }
            })
            .otherwise({
                redirectTo: "/home"
            });
    }

    var checkUserLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').then(function(user) {
            $rootScope.errorMessage = null;
            user = user.data;
            if (user !== '0') {
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/home');
            }
        });
        return deferred.promise;
    };

    var checkVendorLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/vendor/loggedin').then(function(vendor) {
            $rootScope.errorMessage = null;
            vendor = vendor.data;
            if (vendor !== '0') {
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/home');
            }
        });
        return deferred.promise;
    };


})();