(function () {
    angular
        .module("WebAppMaker")
        .controller("EventNewController", EventNewController);

    function EventNewController($routeParams, EventService, $location, UserService) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        //event handler
        vm.createEvent = createEvent;


        function init() {
            EventService
                .findAllEventsForUser(vm.hostID)
                .success(function (events) {
                    vm.events = events;
                })
        }
        init();

        function createEvent(event) {
            EventService
                .createEventForUser(vm.hostID, event)
                .success(function (newEvent) {
                   $location.url("/host/" + vm.hostID + "/event");

                });
        }

    }
})();
