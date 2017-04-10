(function () {
    angular
        .module("WebAppMaker")
        .factory("InviteService", inviteService);

    function inviteService($http) {

        var api = {
            "createInvite": createInvite,
            "findInvitesForUser": findInvitesForUser,
            "findAllInvitesForHost" : findAllInvitesForHost,
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

        function findAllInvitesForHost(hostId) {
            return $http.get("/api/invite/host/"+ hostId);
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