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
            $('#event-time').timepicker();
            $('#event-date').datepicker();

            EventService
                .findAllEventsForUser(vm.hostID)
                .success(function (events) {
                    vm.events = events;
                })
        }
        init();

        function createEvent(event) {
            if(event && event.name && event.location && event.time && event.date){
                EventService
                    .createEventForUser(vm.hostID, event)
                    .success(function (newEvent) {
                        $location.url("/host/" + vm.hostID + "/event");

                    });
            }

        }

    }
})();
