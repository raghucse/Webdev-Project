(function () {
    angular
        .module("WebAppMaker")
        .controller("EventHomeController", EventHomeController);

    function EventHomeController($routeParams, EventService,$location) {
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
                    if(!event.guests.length){
                        vm.totalguests = 0;
                    }
                    else {
                        vm.totalguests = event.guests.length;
                    }

                    if(!event.products.length){
                        vm.totalproducts = 0;
                    }
                    else {
                        vm.totalproducts = event.products.length;
                    }

                    if(!event.services.length){
                        vm.totalservices = 0;
                    }
                    else {
                        vm.totalservices = event.services.length;
                    }
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
