
module.exports =  function(app, OrderModel) {
    app.post("/api/order/:serviceId/:hostId/:vendorId", createOrder);
    app.get("/api/order/:vendorId/order", findAllOrdersForVendor);
    app.get("/api/service/:serviceId/order", findAllOrdersForService);
    app.get("/api/order/:orderId", findOrderById);
    app.put("/api/order/:orderId", updateOrder);
    app.delete("/api/order/:orderId", deleteOrder);


    function createOrder(req, res) {
        var newOrder = req.body;
        var serviceId = req.params.serviceId;
        var hostId = req.params.hostId;
        var vendorId = req.params.vendorId;
        OrderModel.createOrder(serviceId, hostId, vendorId, newOrder)
            .then(function (order) {
                res.json(order);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findAllOrdersForService(req, res) {
        var serviceId = req.params.serviceId;
        OrderModel.findAllOrdersForService(serviceId)
            .then(function (orders) {
                res.json(orders);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findAllOrdersForVendor(req, res) {
        var vendorId = req.params.vendorId;

        OrderModel.findAllOrdersForVendor(vendorId)
            .then(function (orders) {
                res.json(orders);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findOrderById(req, res) {
        var orderId = req.params.orderId;
        OrderModel.findOrderById(orderId)
            .then(function (order) {
                res.json(order);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function updateOrder(req, res) {
        var orderId = req.params.orderId;
        var order = req.body;
        OrderModel.updateOrder(orderId, order)
            .then(function (order) {
                res.json(order);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function deleteOrder(req, res) {
        var orderId = req.params.orderId;
        OrderModel.deleteOrder(orderId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }
};

