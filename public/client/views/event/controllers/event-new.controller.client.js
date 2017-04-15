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
            $(document).ready(function(){
                var date_input=$('input[name="date"]'); //our date input has the name "date"
                var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
                var options={
                    format: 'mm/dd/yyyy',
                    container: container,
                    todayHighlight: true,
                    autoclose: true
                };
                date_input.datepicker(options);
            });

            $('#event-time').timepicker();

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
