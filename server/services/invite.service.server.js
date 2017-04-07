
module.exports = function (app, inviteModel) {
    app.post("/api/invite/:hostId/:guestId/:eventId", createInvite);
    app.get("/api/invite/:guestId", findInvitesForUser);
    app.delete("/api/invite/:eventId", deleteInvite);

    function createInvite(req, res) {
        var hostID = req.params.hostId;
        var guestID = req.params.guestId;
        var eventID = req.params.eventId;
        inviteModel.createInvite(hostID, guestID, eventID)
            .then(function (invite) {
                res.json(invite);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findInvitesForUser(req, res) {
        var guestID = req.params.guestId;
        inviteModel.findAllInvitesForUser(guestID)
            .then(function (invitations) {
                res.json(invitations);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteInvite(req, res) {
        var eventId = req.params.eventId;
        inviteModel.deleteInvite(eventId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

};