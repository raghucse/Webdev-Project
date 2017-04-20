(function () {
    angular
        .module("WebAppMaker")
        .controller("EventHomeController", EventHomeController);

    function EventHomeController($routeParams, EventService, UserService, $location, $rootScope) {
        var vm = this;
        vm.hostID = $routeParams['hid'];
        vm.eventID = $routeParams['eid'];

        //Event Handler
        vm.editEvent = editEvent;
        vm.deleteEvent = deleteEvent;
        vm.logout = logout;

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

                    if(!event.orders.length){
                        vm.totalservices = 0;
                    }
                    else {
                        vm.totalservices = event.orders.length;
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

        function logout() {
            $('#myNavbar').collapse('hide');
            UserService
                .logout()
                .then(function(response) {
                    $rootScope.currentUser = null;
                    $location.url("/home");
                });
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
