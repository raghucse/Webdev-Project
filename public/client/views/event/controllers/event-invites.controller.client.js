
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventInviteController", EventInviteController);

    function EventInviteController($routeParams, InviteService, EventService, UserService,$scope) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        vm.acceptInvitation = acceptInvitation;

        function init() {
            InviteService
                .findInvitesForUser(vm.hostID)
                .success(function (invites) {
                    for(var i = 0; i < invites.length ; i++){
                        (function(i) {
                            UserService
                                .findUserById(invites[i].sender)
                                .then(function (user) {
                                    user = user.data;
                                    invites[i].sender = user.username;
                                });

                            EventService
                                .findEventById(invites[i].event)
                                .then(function (event) {
                                    event = event.data;
                                    invites[i].eventname =  event.name;
                                });
                        })(i);

                    }
                    var unrepliedInvites = [];
                    for(var j =0 ; j < invites.length; j++){
                        if(!invites[j].replied){
                            unrepliedInvites.push(invites[j]);
                        }
                    }
                    vm.invites = unrepliedInvites;
                });
        }
        init();

        function acceptInvitation(invite) {
            InviteService
                .findInviteById(invite._id)
                .success(function (invitaton) {
                    var myinvitation = invitaton[0];
                    myinvitation.replied = true;
                    myinvitation.accepted = true;
                    InviteService
                        .updateInvite(invite._id, myinvitation)
                        .success(function (updatedInvitation) {
                        })


                })


        }
    }
})();