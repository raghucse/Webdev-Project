

(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("PageEditController", PageEditController)
        .controller("PageNewController", PageNewController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userID = $routeParams['uid'];
        vm.websiteID = $routeParams['wid'];


        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteID);
        }
        init();

    }

    function PageEditController($routeParams, PageService, $location) {
        var vm = this;
        vm.userID = $routeParams['uid'];
        vm.websiteID = $routeParams['wid'];
        vm.pageID = $routeParams['pid'];

        //Event Handlers
        vm.deletePage = deletePage;
        vm.editPage = editPage;


        function init() {
            vm.page = PageService.findPageById(vm.pageID);
            vm.pages = angular.copy(PageService.findPageByWebsiteId(vm.websiteID));
        }
        init();

        function deletePage() {
            PageService.deletePage(vm.pageID);
            $location.url("/user/" + vm.userID + "/event/" + vm.websiteID + "/page");
        }

        function editPage(newPage) {
            PageService.updatePage(vm.pageID, newPage);
            $location.url("/user/" + vm.userID + "/event/" + vm.websiteID + "/page");

        }

    }

    function PageNewController($routeParams, PageService, $location) {
        var vm = this;
        vm.userID = $routeParams['uid'];
        vm.websiteID = $routeParams['wid'];

        //Event Handlers
        vm.createPage = createPage;


        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteID);
        }
        init();

        function createPage(newPage) {
            PageService.createPage(vm.websiteID, newPage);
            $location.url("/user/" + vm.userID + "/event/" + vm.websiteID + "/page");
        }

    }

})();