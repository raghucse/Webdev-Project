module.exports = function (mongoose, q) {

    var InviteSchema = require('./invite.schema.server')(mongoose);
    var InviteModel = mongoose.model('InviteModel', InviteSchema);

    var api = {
        "createInvite" : createInvite,
        "findAllInvitesForUser": findAllInvitesForUser,
        "findInviteById" : findInviteById,
        "updateInvite" : updateInvite,
        "deleteInvite": deleteInvite
    };

    return api;

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

    function deleteInvite(eventId) {
        var deferred = q.defer();
        InviteModel.remove({event: eventId}, function (err, event) {
            if(err){
                deferred.reject(err);
            }
            else {
                event.remove();
                deferred.resolve(event);
            }
        });
        return deferred.promise;
    }


};