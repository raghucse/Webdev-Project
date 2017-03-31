(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteEditController($routeParams, WebsiteService,$location) {
        var vm = this;
        vm.userID = $routeParams['uid'];
        vm.websiteID = $routeParams['wid'];

        //Event Handler
        vm.editWebsite = editWebsite;
        vm.deleteSite = deleteSite;

        function init() {
            vm.website = WebsiteService.findWebsiteById(vm.websiteID);
            vm.websites = angular.copy(WebsiteService.findWebsitesByUser(vm.userID));
        }
        init();

        function editWebsite(newWebsite) {
            WebsiteService.updateWebsite(vm.websiteID, newWebsite);
            $location.url("/user/" + vm.userID + "/website/");
        }

        function deleteSite(){
            WebsiteService.deleteWebsite(vm.websiteID);
            $location.url("/user/" + vm.userID + "/website/");

        }

    }
})();
