module.exports = function (mongoose) {

    var types = ["USER", "ADMIN"];
    var UserSchema = mongoose.Schema({
        type: {type: String, enum: types},
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        phone: String,
        address: String,
        dateCreated: { type: Date, default: Date.now },
        facebook: {
            id:    String,
            token: String
        }
    }, {collection: 'myPartyPlanDB.user'});

    UserSchema.pre('remove', function(next) {
        this.model('EventModel')
            .find({host: this._id }, function (err, events) {
                events.forEach(function(event){
                    event.remove(function(err){
                    });
                })
            });
    });

    return UserSchema;
};