
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
                    vm.allGuests = event.guests;
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

                    var acceptedGuests = [];
                    var pennGuests = [];
                    for(var i = 0; i < invites.length; i++){
                        (function(i) {
                        if(invites[i].replied && invites[i].accepted){
                            UserService
                                .findUserById(invites[i].receiver)
                                .then(function (user) {
                                    user = user.data;
                                    acceptedGuests.push(user.username);
                                })
                        }
                        else if(!invites[i].replied || !invites[i].accepted){
                            UserService
                                .findUserById(invites[i].receiver)
                                .then(function (user) {
                                    user = user.data;
                                    pennGuests.push(user.username);
                                })
                        }
                        })(i);
                    }

                    vm.acceptedGuests = acceptedGuests;
                    vm.pennGuests = pennGuests;
                });
        }
        init();

        function findUser(username) {
            UserService
                .findUserByUsername(username)
                .success(function (user) {
                    vm.guestname = user[0].username;
                    vm.guestID = user[0]._id;
                })
        }

        function createInvite() {
            for(var g in vm.allGuests){
                if(vm.allGuests[g] == vm.guestID){
                    var guestPresent = true;
                }
                if(vm.guestID == vm.hostID){
                    var selfInvite = true;
                }
            }
            if(!guestPresent && !selfInvite){
                InviteService
                    .createInvite(vm.hostID, vm.guestID, vm.eventID)
                    .success(function (invite) {
                        EventService
                            .addGuest(vm.eventID, vm.guestID)
                            .success(function (invitation) {
                                vm.invitationstatus = "Invitation Sent";
                            });
                    });
            }else if(guestPresent && !selfInvite){
                vm.invitationstatus = "Invitation Already Sent to this user"
            }else if(!guestPresent && selfInvite){
                vm.invitationstatus = "You cannot send Invitation to yourself"
            }


        }



    }
})();