
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
                    var myguests = [];
                    var guestsList = event.guests;

                    for(var i = 0; i < guestsList.length ; i++){
                        vm.index = i;
                        UserService
                            .findUserById(guestsList[i])
                            .success(function (user) {
                                myguests.push(user.username);
                            });
                    }
                    vm.guests = myguests;
                });

            InviteService
                .findAllInvitesForHost(vm.hostID)
                .success(function (invites) {
                    var invitesList = invites;
                    var acceptedGuests = [];
                    var pennGuests = [];
                    for(var i = 0; i < invitesList.length; i++){
                        vm.indexi = i;
                        if(invitesList[vm.indexi].replied && invitesList[vm.indexi].accepted){
                            UserService
                                .findUserById(invitesList[vm.indexi].receiver)
                                .success(function (user) {
                                    acceptedGuests.push(user.username);
                                })
                        }
                        else if(!invitesList[vm.indexi].replied || !invitesList[vm.indexi].accepted){
                            UserService
                                .findUserById(invitesList[vm.indexi].receiver)
                                .success(function (user) {
                                    pennGuests.push(user.username);
                                })
                        }
                    }

                    vm.acceptedGuests = acceptedGuests;
                    vm.pennGuests = pennGuests;
                    console.log(pennGuests);
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