
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
        vm.refreshData = refreshData;
        vm.cancelInvitation = cancelInvitation;
        vm.showGuestDetails = showGuestDetails;

        function init() {
            vm.guests = undefined;
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
                });
        }
        init();

        function refreshData() {
            init();
        }

        function showGuestDetails(guest) {
            vm.guestDetails = guest;
        }

        function findUser(username) {
            UserService
                .findUserByUsername(username)
                .success(function (user) {
                    vm.guestname = user[0].username;
                    vm.guestID = user[0]._id;
                })
        }

        function createInvite() {
            var guestPresent = false;
            var selfInvite = false;

            for(var i = 0; i < vm.allGuests.length ; i++){
                if(vm.allGuests[i] == vm.guestID){
                    guestPresent = true;
                }
                if(vm.guestID == vm.hostID){
                    selfInvite = true;
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
            init();
        }

        // OrderService
        //     .updateOrder(order._id, newOrder)
        //     .success(function (response) {
        //         EventService
        //             .findEventById(vm.eventID)
        //             .success(function (myevent) {
        //                 var orders = myevent.orders;
        //                 for(var p in orders){
        //                     if(orders[p] == order._id){
        //                         orders.splice(p, 1);
        //                     }
        //                 }
        //                 myevent.orders = orders;
        //                 EventService
        //                     .updateEvent(vm.eventID, myevent)
        //                     .success(function (response) {
        //                         init();
        //                     })
        //
        //             });
        //     })

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

    }
})();