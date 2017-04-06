
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventGuestController", EventGuestController);

    function EventGuestController($routeParams, InviteService, EventService, UserService) {
        var vm = this;
        vm.hostID = $routeParams['hid'];
        vm.eventID = $routeParams['eid'];

        vm.findUser = findUser;
        vm.createInvite = createInvite;

        function init() {
            EventService
                .findEventById(vm.eventID)
                .success(function (event) {
                    vm.event = event;
                });

            InviteService
                .findInvitesForUser(vm.hostID)
                .success(function (invites) {
                    vm.invites = invites;
                });
        }
        init();

        function findUser(username) {
            UserService
                .findUserByUsername(username)
                .success(function (user) {
                    vm.guestname = user[0].username;
                    vm.guestID = user[0]._id;
                    console.log(vm.guestID);
                })
        }

        function createInvite() {
            InviteService
                .createInvite(vm.hostID, vm.guestID, vm.eventID)
                .success(function (invite) {
                EventService
                    .addGuest(vm.eventID, vm.guestID)
                    .success(function (invitation) {
                        vm.invitationsuccess = "Invitation Sent";
                    });
                });
        }



    }
})();