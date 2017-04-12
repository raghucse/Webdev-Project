
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventListController", EventListController);

    function EventListController($routeParams, EventService, UserService, InviteService, $rootScope, $location) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        //event handlers
        vm.updateUser = updateUser;
        vm.logout = logout;
        vm.acceptInvitation = acceptInvitation;
        vm.deleteUser = deleteUser;
        vm.cancelInvitation = cancelInvitation;
        vm.refreshData  = refreshData;

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
                    var upcomingEvents =[];
                    for(var j =0 ; j < invites.length; j++){
                        if(!invites[j].replied){
                            unrepliedInvites.push(invites[j]);
                        }
                        if(invites[j].accepted){
                            upcomingEvents.push(invites[j]);
                        }
                    }
                    vm.invites = unrepliedInvites;
                    vm.upcomingEvents = upcomingEvents;
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

        function refreshData() {
            init();
        }

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
            InviteService
                .findInviteById(invite._id)
                .success(function (invitaton) {
                    var myinvitation = invitaton[0];
                    myinvitation.replied = true;
                    myinvitation.accepted = true;
                    InviteService
                        .updateInvite(invite._id, myinvitation)
                        .success(function (updatedInvitation) {
                            init();
                        })
                })
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
                            init();
                        })
                })
        }

        function deleteUser(user) {
            var ans = confirm("Are you sure that you want to UnRegister?")
            if(ans){
                UserService
                    .deleteUser(user._id)
                    .success(function () {
                        $location.url("/login");
                    })
                    .error(function () {
                        vm.error = "Unable to UnRegister User";
                    })
            }

        }


    }
})();