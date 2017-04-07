/**
 * Created by raghu on 2/8/2017.
 */
module.exports =  function(app, OrderModel) {
    app.get("/api/service/:serviceId/order", findAllOrdersForService);
    app.get("/api/order/:orderId", findOrderById);
    app.put("/api/order/:orderId", updateOrder);
    app.delete("/api/order/:orderId", deleteOrder);
    app.post("/api/service/:serviceId/order", createOrder);
    app.put("/api/order/:orderId/page/:pageId", updatePage);

    function createOrder(req, res) {
        var newOrder = req.body;
        serviceId = req.params.serviceId;

        OrderModel.createOrderForService(serviceId, newOrder)
            .then(function (order) {
                res.json(order);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function findAllOrdersForService(req, res) {
        var serviceId = req.params.serviceId;
        console.log(serviceId);
        OrderModel.findAllOrdersForService(serviceId)
            .then(function (orders) {
                res.json(orders);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
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

    function updatePage(req, res) {
        var orderId = req.params.orderId;
        var pageId = req.params.pageId;

        OrderModel.updatePage(orderId, pageId)
            .then(function (order) {
                res.send(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }
}

