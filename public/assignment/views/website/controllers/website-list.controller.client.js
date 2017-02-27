
(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userID = $routeParams['uid'];


        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userID);
        }
        init();

    }
})();