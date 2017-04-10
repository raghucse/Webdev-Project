(function () {
    angular
        .module("WebAppMaker")
        .factory("InviteService", inviteService);

    function inviteService($http) {

        var api = {
            "createInvite": createInvite,
            "findInvitesForUser": findInvitesForUser,
            "updateInvite" : updateInvite,
            "deleteInvite": deleteInvite,
            "findInviteById" : findInviteById
        };

        return api;

        function createInvite(hostId, guestId, eventId) {
            return $http.post("/api/invite/" + hostId + "/" + guestId + "/" + eventId);
        }

        function findInvitesForUser(guestId) {
            return $http.get("/api/invite/" + guestId);
        }

        function findInviteById(inviteId) {
            return $http.get("/api/invite/invitation/" + inviteId);
        }

        function updateInvite(inviteId, invite) {
            return $http.put("/api/invite/invitation/" + inviteId, invite);
        }

        function deleteInvite(eventID) {
            return $http.delete("/api/invite/" + eventId);
        }

    }

})();