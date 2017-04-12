
(function () {
    angular
        .module("WebAppMaker")
        .controller("GuestController", guestController);

    function guestController($routeParams, InviteService, EventService, UserService) {
        var vm = this;
        vm.guestID = $routeParams['gid'];
        vm.eventID = $routeParams['eid'];


        function init() {
            EventService
                .findEventById(vm.eventID)
                .success(function (event) {
                    vm.event = event;
                });

            EventService
                .findAllGuestsForEvent(vm.eventID)
                .success(function (guests) {
                    var guestIDList = guests[0].guests;
                    var guestList = [];
                    for(var i = 0; i < guestIDList.length ; i++){
                        var guestid = guestIDList[i];
                        UserService
                            .findUserById(guestid)
                            .success(function (user) {
                                guestList.push(user.username);
                            })
                    }
                    vm.guests = guestList;
                });

        }
        init();



    }
})();