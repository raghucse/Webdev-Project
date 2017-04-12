(function () {
    angular
        .module("WebAppMaker")
        .controller("EventEditController", EventEditController);

    function EventEditController($routeParams, EventService,$location) {
        var vm = this;
        vm.hostID = $routeParams['hid'];
        vm.eventID = $routeParams['eid'];

        //Event Handler
        vm.editEvent = editEvent;
        vm.deleteEvent = deleteEvent;

        function init() {
            $('#edit-event-time').timepicker();
            $('#edit-event-date').datepicker();

            EventService
                .findEventById(vm.eventID)
                .success(function (event) {
                    vm.event = event;
                });
            EventService
                .findAllEventsForUser(vm.hostID)
                .success(function (events) {
                    vm.events = angular.copy(events);
                })
        }
        init();

        function editEvent(event) {
            if(event && event.name && event.location && event.time && event.date){
                EventService
                    .updateEvent(vm.eventID, event)
                    .success(function () {
                        $location.url("/host/" + vm.hostID + "/event/");
                    })
            }

        }

        function deleteEvent(){
            EventService
                .deleteEvent(vm.eventID)
                .success(function () {
                    $location.url("/host/" + vm.hostID + "/event/");
                })

        }

    }
})();
