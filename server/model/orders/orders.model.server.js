module.exports = function (mongoose, q) {

    var OrderSchema = require('./orders.schema.server.js')(mongoose);
    var OrderModel = mongoose.model('OrderModel', OrderSchema);

    var api = {
        createOrder: createOrder,
        findAllOrdersForVendor: findAllOrdersForVendor,
        findAllOrdersForService: findAllOrdersForService,
        findOrderById: findOrderById,
        updateOrder: updateOrder,
        deleteOrder: deleteOrder
    };
    return api;

    function createOrder(serviceId, hostId, vendorId, order) {
        var deferred = q.defer();
        order.service = serviceId;
        order.vendor = vendorId;
        order.user = hostId;

        OrderModel.create(order, function (err, doc) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(doc);
            }
        });

        return deferred.promise;
    }

    function findAllOrdersForVendor(vendorId) {
        var deferred = q.defer();

        OrderModel.find({vendor : vendorId}, function (err, orders) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(orders);
            }
        });
        return deferred.promise;
    }

    function findAllOrdersForService(serviceId) {
        var deferred = q.defer();

        OrderModel.find({service: serviceId}, function (err, orders) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(orders);
            }
        });
        return deferred.promise;
    }

    function findOrderById(orderId) {
        var deferred = q.defer();

        OrderModel.findById(orderId, function (err, order) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(order);
            }
        });
        return deferred.promise;
    }

    function updateOrder(orderId, order) {
        var deferred = q.defer();

        OrderModel.update({_id:orderId},
            {$set:order}
            , function (err, order) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(order);
                }
            });
        return deferred.promise;

    }

    function deleteOrder(orderId) {
        var deferred = q.defer();
        OrderModel.findById(orderId, function (err, order) {
            if(err){
                deferred.reject(err);
            }
            else {
                order.remove(function (err) {
                    deferred.resolve();
                });
            }
        });
        return deferred.promise;
    }


};