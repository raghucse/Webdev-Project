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

        function editEvent(newEvent) {
            EventService
                .updateEvent(vm.eventID, newEvent)
                .success(function () {
                    $location.url("/host/" + vm.hostID + "/event/");
                })
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
