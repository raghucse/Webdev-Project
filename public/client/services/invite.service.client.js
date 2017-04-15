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
            "findInviteById" : findInviteById,
            "findInvite" : findInvite,
            "findNotAttendingGuests" :findNotAttendingGuests,
            "findInviteByEventAndGuest" :findInviteByEventAndGuest
        };

        return api;

        function findNotAttendingGuests(hostId, eventId) {
            return $http.get("/api/invite/notComing/" + hostId + "/" + eventId)
        }

        function createInvite(hostId, guestId, eventId) {
            return $http.post("/api/invite/" + hostId + "/" + guestId + "/" + eventId);
        }

        function findInvite(eventId, hostId, guestId) {
            return $http.get("/api/invite/invitation/" + eventId + "/" + hostId + "/" + guestId);
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

        function deleteInvite(guestId) {
            return $http.delete("/api/invite/delete/" + guestId);
        }

        function findInviteByEventAndGuest(guestId, eventId) {
            return $http.get("/api/invite/"+guestId+"/event/"+eventId);
        }

    }

})();