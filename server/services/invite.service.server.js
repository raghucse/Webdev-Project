
module.exports = function (app, inviteModel) {
    app.post("/api/invite/:hostId/:guestId/:eventId", createInvite);
    app.get("/api/invite/:guestId", findInvitesForUser);
    app.get("/api/invite/host/:hostId", findAllInvitesForHost);
    app.get("/api/invite/invitation/:inviteId", findInviteById);
    app.get("/api/invite/invitation/:eventId/:hostId/:guestId", findInvite);
    app.put("/api/invite/invitation/:inviteId", updateInvite);
    app.delete("/api/invite/delete/:guestId", deleteInvite);
    app.get("/api/invite/notComing/:hostId/:eventId", findNotAttendingGuests);
    app.get("/api/invite/:guestId/event/:eventId", findInviteByEventAndGuest);


    function findInviteByEventAndGuest(req, res) {
        var guestId = req.params.guestId;
        var eventId = req.params.eventId;

        inviteModel.findInviteByEventAndGuest(guestId, eventId)
            .then(function (invite) {
                res.json(invite);
            }, function (err) {
                res.sendStatus(500).send(err)
            })
    }

    function findNotAttendingGuests(req, res) {
        var hostID = req.params.hostId;
        var eventID = req.params.eventId;
        inviteModel.findNotAttendingGuests(eventID, hostID)
            .then(function (invite) {
                res.json(invite);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

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

    function findAllInvitesForHost(req, res) {
        var hostID = req.params.hostId;
        inviteModel.findAllInvitesForHost(hostID)
            .then(function (invitations) {
                res.json(invitations);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findInviteById(req, res) {
        var inviteID = req.params.inviteId;
        inviteModel.findInviteById(inviteID)
            .then(function (invitation) {
                res.json(invitation);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findInvite(req, res) {
        var eventID = req.params.eventId;
        var hostID = req.params.hostId;
        var guestID = req.params.guestId;
        inviteModel.findInvite(eventID, hostID, guestID)
            .then(function (invitation) {
                res.json(invitation);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function updateInvite(req, res) {
        var inviteId = req.params.inviteId;
        var newInvite = req.body;
        inviteModel.updateInvite(inviteId, newInvite)
            .then(function (invite) {
                res.json(invite);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteInvite(req, res) {
        var guestId = req.params.guestId;
        inviteModel.deleteInvite(guestId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

};