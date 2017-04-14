module.exports = function (mongoose) {

    var InviteSchema = mongoose.Schema({
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        event : {type:mongoose.Schema.Types.ObjectId, ref: 'EventModel'},
        replied : Boolean,
        accepted : Boolean
    }, {collection: 'myPartyPlanDB.invite'});

    InviteSchema.pre('remove', function(next) {
        this.model('EventModel').update(
            {_id: this.event},
            {$pull: {guests: this.receiver}},
            {multi: true},
            next
        );
    });

    return InviteSchema;
};