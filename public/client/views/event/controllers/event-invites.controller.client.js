
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventInviteController", EventInviteController);

    function EventInviteController($routeParams, InviteService, EventService, UserService) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        vm.acceptInvitation = acceptInvitation;

        function init() {
            InviteService
                .findInvitesForUser(vm.hostID)
                .success(function (invites) {
                    var myinvites = [];
                    var invitesList = invites;

                    for(var i = 0; i < invitesList.length ; i++){
                        vm.index = i;
                        UserService
                            .findUserById(invitesList[i].sender)
                            .success(function (user) {
                                var invitation = {};
                                invitation["sender"] = user.username;
                                invitation["eventID"] = invitesList[vm.index].event;
                                invitation["inviteID"] = invitesList[vm.index]._id;
                                EventService
                                    .findEventById(invitesList[vm.index].event)
                                    .success(function (event) {
                                        invitation["eventname"] = event.name;
                                    });

                                myinvites.push(invitation);
                            });
                    }
                    vm.invites = myinvites;
                });
        }
        init();

        function acceptInvitation(invite) {
            InviteService
                .findInviteById(invite.inviteID)
                .success(function (invitaton) {
                    var myinvitation = invitaton[0];
                    myinvitation.replied = true;
                    myinvitation.accepted = true;
                    InviteService
                        .updateInvite(invite.inviteID, myinvitation)
                        .success(function (updatedInvitation) {
                            console.log("invitation accepted");
                        })


                })


        }
    }
})();