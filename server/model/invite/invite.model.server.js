module.exports = function (mongoose, q) {

    var InviteSchema = require('./invite.schema.server')(mongoose);
    var InviteModel = mongoose.model('InviteModel', InviteSchema);

    var api = {
        "createInvite" : createInvite,
        "findAllInvitesForUser": findAllInvitesForUser,
        "findAllInvitesForHost" : findAllInvitesForHost,
        "findInviteById" : findInviteById,
        "findInvite" : findInvite,
        "updateInvite" : updateInvite,
        "deleteInvite": deleteInvite,
        "findNotAttendingGuests": findNotAttendingGuests,
        "findInviteByEventAndGuest": findInviteByEventAndGuest
    };

    return api;

    function findInviteByEventAndGuest(guestId, eventId) {
        var deferred = q.defer();
        InviteModel.find({event : eventId, receiver : guestId}, function (err, invite) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(invite);
            }
        });
        return deferred.promise;
    }


    function findNotAttendingGuests(eventId, hostId) {
        var deferred = q.defer();
        InviteModel.find({event : eventId, sender : hostId, accepted: false}, function (err, invite) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(invite);
            }
        });
        return deferred.promise;
    }

    function createInvite(hostId, guestID, eventID) {
        var deferred = q.defer();
        var invite = {};
        invite.sender = hostId;
        invite.receiver = guestID;
        invite.event = eventID;
        invite.replied = false;
        invite.accepted = false;
        InviteModel.create(invite, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findAllInvitesForUser(guestId) {
        var deferred = q.defer();
        InviteModel.find({receiver: guestId}, function (err, events) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(events);
            }
        });
        return deferred.promise;
    }

    function findAllInvitesForHost(hostID) {
        var deferred = q.defer();
        InviteModel.find({sender: hostID}, function (err, invites) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(invites);
            }
        });
        return deferred.promise;
    }

    function findInviteById(inviteId) {
        var deferred = q.defer();
        InviteModel.find({_id: inviteId}, function (err, events) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(events);
            }
        });
        return deferred.promise;
    }

    function findInvite(eventId, hostId, guestId) {
        var deferred = q.defer();
        InviteModel.find({event : eventId, sender : hostId, receiver : guestId}, function (err, invite) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(invite);
            }
        });
        return deferred.promise;

    }

    function updateInvite(inviteId, invite) {
        var deferred = q.defer();
        InviteModel.update({ _id:inviteId }, invite
            , function (err, updatedInvite) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(updatedInvite);
                }
            });
        return deferred.promise;
    }

    function deleteInvite(guestId) {
        var deferred = q.defer();
        InviteModel.findByIdAndRemove({_id: guestId}, function (err, invite) {
            if(err){
                deferred.reject(err);
            }
            else {
                invite.remove();
                deferred.resolve(invite);
            }
        });
        return deferred.promise;
    }


};