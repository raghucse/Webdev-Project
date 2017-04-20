
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventGuestController", EventGuestController);

    function EventGuestController($routeParams, InviteService, EventService, UserService, $rootScope, $location) {
        var vm = this;
        vm.hostID = $routeParams['hid'];
        vm.eventID = $routeParams['eid'];

        vm.findUser = findUser;
        vm.createInvite = createInvite;
        vm.refreshData = refreshData;
        vm.cancelInvitation = cancelInvitation;
        vm.showGuestDetails = showGuestDetails;
        vm.logout = logout;
        vm.deleteInvite = deleteInvite;

        function init() {
            vm.guests = [];
            vm.notComingguests = [];
            vm.acceptedGuests = [];
            vm.pennGuests = [];

            EventService
                .findEventById(vm.eventID)
                .then(function (event) {
                    event = event.data;
                    vm.event = event;
                    var myguests = [];
                    var guestsList = event.guests;
                    vm.allGuests = event.guests;
                    for(var i = 0; i < guestsList.length ; i++){
                        vm.index = i;
                        UserService
                            .findUserById(guestsList[i])
                            .success(function (user) {
                                myguests.push(user);
                            });
                    }
                    vm.guests = myguests;
                });


            InviteService
                .findAllInvitesForHost(vm.hostID)
                .success(function (invites) {
                    var acceptedGuests = [];
                    var pennGuests = [];
                    var rejectedGuest = [];
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
                            else if(invites[i].replied && !invites[i].accepted){
                                UserService
                                    .findUserById(invites[i].receiver)
                                    .then(function (user) {
                                        user = user.data;
                                        rejectedGuest.push(user)
                                    })
                            }
                            else if(!invites[i].replied){
                                UserService
                                    .findUserById(invites[i].receiver)
                                    .then(function (user) {
                                        user = user.data;
                                        invites[i].username = user.username;
                                        pennGuests.push(invites[i]);
                                    })
                            }
                        })(i);
                    }

                    vm.acceptedGuests = acceptedGuests;
                    vm.pennGuests = pennGuests;
                    vm.notComingguests = rejectedGuest;
                });


        }
        init();

        function refreshData() {
            vm.guestNotFound =  undefined;
            init();
        }

        function showGuestDetails(guest) {
            vm.guestDetails = guest;
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

        function findUser(username) {
            vm.guestNotFound =  undefined;
            vm.guestname = undefined;
            UserService
                .findUserByUsername(username)
                .success(function (user) {
                    if(!user[0]){
                        vm.guestNotFound = "User not found";
                    }else
                    {
                        vm.guestname = user[0].username;
                        vm.guestID = user[0]._id;
                    }
                })
        }

        function createInvite() {
            vm.invitationstatus = undefined;
            var inviteSent = false;
            var selfInvite = false;

            if(vm.guestID == vm.hostID){
                selfInvite = true;
            }


            if(!selfInvite){
                InviteService.findInvite(vm.eventID, vm.hostID, vm.guestID)
                    .then(function(invite){
                        var invite = invite.data[0];
                        if(invite){
                            vm.invitationstatus = "Invitation Already Sent to this user"
                        }
                        else {
                            InviteService
                                .createInvite(vm.hostID, vm.guestID, vm.eventID)
                                .success(function (invite) {
                                    EventService
                                        .addGuest(vm.eventID, vm.guestID)
                                        .success(function (invitation) {
                                            vm.invitationstatus = "Invitation Sent";
                                        });
                                });
                        }
                    })
            }else if(selfInvite){
                vm.invitationstatus = "You cannot send Invitation to yourself"
            }
            init();
        }


        function cancelInvitation(invite) {
            InviteService
                .findInviteById(invite._id)
                .success(function (invitaton) {
                    var myinvitation = invitaton[0];
                    myinvitation.replied = true;
                    myinvitation.accepted = false;
                    InviteService
                        .updateInvite(invite._id, myinvitation)
                        .success(function (updatedInvitation) {
                            EventService
                                .findEventById(vm.eventID)
                                .success(function (myevent) {
                                    var myguests = myevent.guests;
                                    for(var p in myguests){
                                        if(myguests[p] == invitaton[0].receiver){
                                            myguests.splice(p, 1);
                                        }
                                    }
                                    myevent.guests = myguests;
                                    EventService
                                        .updateEvent(vm.eventID, myevent)
                                        .success(function (response) {
                                            init();
                                        })
                                });
                        })
                })
        }

        function deleteInvite(guest) {
            InviteService.deleteInvite(guest)
                .then(function () {
                    vm.inviteDelted = "Invite Deleted"
                    init();
                })
        }

    }
})();