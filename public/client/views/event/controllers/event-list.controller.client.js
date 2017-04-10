
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventListController", EventListController);

    function EventListController($routeParams, EventService, UserService, InviteService) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        //event handlers
        vm.updateUser = updateUser;
        vm.logout = logout;
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

            EventService
                .findAllEventsForUser(vm.hostID)
                .success(function (events) {
                    vm.events = events;
                });

            var promise = UserService.findUserById(vm.hostID);
            promise.success(function (user) {
                vm.user = user;
            });
        }
        init();


        function updateUser(newUser) {
            UserService
                .updateUser(vm.hostID, newUser)
                .success(function (updatedUser) {
                    if(updatedUser == null){
                        vm.error = "Unable to Update User";
                    }else{
                        vm.message = "User Successfully Updated";
                    }
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function(response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                });
        }

        function acceptInvitation(invite) {
            console.log(invite);
            InviteService
                .findInviteById(invite._id)
                .success(function (invitaton) {
                    var myinvitation = invitaton[0];
                    myinvitation.replied = true;
                    myinvitation.accepted = true;
                    InviteService
                        .updateInvite(invite._id, myinvitation)
                        .success(function (updatedInvitation) {
                            console.log("invitation accepted");
                        })
                })
        }

    }
})();