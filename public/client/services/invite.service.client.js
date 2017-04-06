(function () {
    angular
        .module("WebAppMaker")
        .factory("InviteService", inviteService);

    function inviteService($http) {

        var api = {
            "createInvite": createInvite,
            "findInvitesForUser": findInvitesForUser,
            "deleteInvite": deleteInvite
        };

        return api;

        function createInvite(hostId, guestId, eventId) {
            return $http.post("/api/invite/" + hostId + "/" + guestId + "/" + eventId);
        }

        function findInvitesForUser(guestId) {
            return $http.get("/api/invite/" + guestId);
        }

        function deleteInvite(eventID) {
            return $http.delete("/api/invite/" + eventId);
        }

    }

})();