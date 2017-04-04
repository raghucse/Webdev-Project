
(function () {
    angular
        .module("WebAppMaker")
        .controller("EditWidgetController", EditWidgetController);

    function EditWidgetController($routeParams, WidgetService, $location) {
        var vm = this;
        vm.userID = $routeParams['uid'];
        vm.websiteID = $routeParams['wid'];
        vm.pageID = $routeParams['pid'];
        vm.widgetID = $routeParams['wgid'];


        //Event Handler
        vm.updateWid = updateWid;
        vm.deleteWidget = deleteWidget;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetID);
        }
        init();

        function updateWid(widget) {
            WidgetService.updateWidget(vm.widgetID, widget);
            $location.url("/user/" + vm.userID + "/event/" + vm.websiteID + "/page/" + vm.pageID + "/widget");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetID);
            $location.url("/user/" + vm.userID + "/event/" + vm.websiteID + "/page/" + vm.pageID + "/widget");
        }

    }

})();
