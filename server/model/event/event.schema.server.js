module.exports = function (mongoose) {

    var EventSchema = mongoose.Schema({
        host: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        name: String,
        description : String,
        location: String,
        address : String,
        date: String,
        time: String,
        orders: [{type:mongoose.Schema.Types.ObjectId, ref: 'OrderModel'}],
        products: [{type:mongoose.Schema.Types.ObjectId, ref: 'ShoppingModel'}],
        guests : [{type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        dateCreated: { type: Date, default: Date.now }
    }, {collection: 'myPartyPlanDB.event'});

    EventSchema.pre('remove', function(next) {

        this.model('ShoppingModel')
            .find({_host: this.host }, function (err, items) {
                items.forEach(function(item){
                    item.remove(function(err){
                    });
                })
            });

        this.model('InviteModel')
            .find({event: this._id }, function (err, invites) {
                invites.forEach(function(invite){
                    invite.remove(function(err){
                    });
                })
            });

        this.model('OrderModel')
            .find({user: this.host }, function (err, orders) {
                orders.forEach(function(order){
                    order.update(
                        { $set: { cancelled: true }}
                    );
                })
            });
        next();
    });


    return EventSchema;
};