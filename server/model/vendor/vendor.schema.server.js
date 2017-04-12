module.exports = function (mongoose) {

    var q = require('q');


    var VendorSchema = mongoose.Schema({
        vendorname: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        cityname: String,
        services: [{type:mongoose.Schema.Types.ObjectId, ref: 'ServiceModel'}],
        dateCreated: { type: Date, default: Date.now },
        facebook: {
            id:    String,
            token: String
        }
    }, {collection: 'myPartyPlanDB.vendor'});

    VendorSchema.pre('remove', function(next) {

        this.model('ServiceModel')
            .find({_vendor: this._id }, function (err, websites) {
                websites.forEach(function(website){
                    website.remove(function(err){

                    });
                })
            });
        next();
    });

    return VendorSchema;
};