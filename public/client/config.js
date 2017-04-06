(function () {
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/login",{
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/",{
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register",{
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/host/:hid/event/profile",{
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/host/:hid/event",{
                templateUrl: "views/event/templates/event-list.view.client.html",
                controller: "EventListController",
                controllerAs: "model"
            })
            .when("/host/:hid/event/home",{
                templateUrl: "views/event/templates/event-list.view.client.html",
                controller: "EventListController",
                controllerAs: "model"
            })
            .when("/host/:hid/event/new",{
                templateUrl: "views/event/templates/event-new.view.client.html",
                controller: "EventNewController",
                controllerAs: "model"
            })
            .when("/host/:hid/event/:eid",{
                templateUrl: "views/event/templates/event-edit.view.client.html",
                controller: "EventEditController",
                controllerAs: "model"
            })
            .when("/host/:hid/event/:eid/home",{
                templateUrl: "views/event/templates/event-home.view.client.html",
                controller: "EventHomeController",
                controllerAs: "model"
            })
            .when("/user/:uid/event/:wid/page",{
                templateUrl: "views/page/templates/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model"
            })
            .when("/user/:uid/event/:wid/page/new",{
                templateUrl: "views/page/templates/page-new.view.client.html",
                controller: "PageNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/event/:wid/page/:pid",{
                templateUrl: "views/page/templates/page-edit.view.client.html",
                controller: "PageEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/event/:wid/page/:pid/widget",{
                templateUrl: "views/widget/templates/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model"
            })
            .when("/user/:uid/event/:wid/page/:pid/widget/new",{
                templateUrl: "views/widget/templates/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model"
            })
            .when("/user/:uid/event/:wid/page/:pid/widget/:wgid",{
                templateUrl: "views/widget/templates/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model"
            })
            .when("/vendor/login",{
                templateUrl: "views/user/templates/vendor.login.view.client.html",
                controller: "VendorLoginController",
                controllerAs: "model"
            })
            .when("/vendor/register",{
                templateUrl: "views/user/templates/vendor.register.view.client.html",
                controller: "VendorRegisterController",
                controllerAs: "model"
            })
            .when("/vendor/:vid",{
                templateUrl: "views/user/templates/vendor.profile.view.client.html",
                controller: "VendorProfileController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/login"
            });
    }

})();