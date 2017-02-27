(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, WebsiteService, $location) {
        var vm = this;
        vm.userID = $routeParams['uid'];
        
        //event handler
        vm.createWebsite = createWebsite;


        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userID);
        }
        init();
        
        function createWebsite(website) {
            WebsiteService.createWebsite(vm.userID, website);
            $location.url("/user/" + vm.userID + "/website");
            
        }

    }
})();
