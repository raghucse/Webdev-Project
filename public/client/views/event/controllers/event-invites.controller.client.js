
(function () {
    angular
        .module("WebAppMaker")
        .controller("EventInviteController", EventInviteController);

    function EventInviteController($routeParams, InviteService, EventService, UserService) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        function init() {
            InviteService
                .findInvitesForUser(vm.hostID)
                .success(function (invites) {
                    vm.invites = invites;
                });
        }
        init();
    }
})();