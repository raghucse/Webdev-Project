
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventListController", EventListController);

    function EventListController($routeParams, EventService) {
        var vm = this;
        vm.hostID = $routeParams['hid'];


        function init() {
            EventService
                .findAllEventsForUser(vm.hostID)
                .success(function (events) {
                    vm.events = events;
                })
        }
        init();

    }
})();