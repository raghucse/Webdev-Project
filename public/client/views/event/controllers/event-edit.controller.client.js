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
            $(document).ready(function(){
                var date_input=$('input[name="editDate"]'); //our date input has the name "date"
                var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
                var options={
                    format: 'mm/dd/yyyy',
                    container: container,
                    todayHighlight: true,
                    autoclose: true
                };
                date_input.datepicker(options);
            });

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
            if(event && event.name && event.location && event.time && event.date && event.address){
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
