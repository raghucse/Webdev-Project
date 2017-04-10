module.exports = function (mongoose) {

    var InviteSchema = mongoose.Schema({
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        event : {type:mongoose.Schema.Types.ObjectId, ref: 'EventModel'},
        replied : Boolean,
        accepted : Boolean
    }, {collection: 'myPartyPlanDB.invite'});

    return InviteSchema;
};