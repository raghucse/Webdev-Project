
module.exports = function (app, eventModel) {
    app.post("/api/user/:hostId/event", createEvent);
    app.get("/api/user/:hostId/event", findEventsForUser);
    app.get("/api/guest/event/guests/:eventId", findAllGuestsForEvent);
    app.get("/api/guest/event/products/:eventId", findAllProductsForEvent);
    app.get("/api/guest/event/orders/:eventId", findAllOrdersForEvent);
    app.get("/api/event/:eventId", findEventById);
    app.put("/api/event/:eventId", updateEvent);
    app.delete("/api/event/:eventId", deleteEvent);
    app.put("/api/event/:eventId/guest/:guestId", addGuest);
    app.put("/api/event/:eventId/order/:orderId", addOrder);
    app.put("/api/event/:eventId/product/:productId", addProduct);

    function createEvent(req, res) {
        var hostID = req.params.hostId;
        var newEvent = req.body;
        eventModel.createEventForUser(hostID, newEvent)
            .then(function (event) {
                res.json(event);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findEventsForUser(req, res) {
        var hostId = req.params.hostId;
        eventModel.findAllEventsForUser(hostId)
            .then(function (events) {
                res.json(events);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllGuestsForEvent(req, res) {
        var eventId = req.params.eventId;
        eventModel.findAllGuestsForEvent(eventId)
            .then(function (guests) {
                res.json(guests);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllProductsForEvent(req, res) {
        var eventId = req.params.eventId;
        eventModel.findAllProductsForEvent(eventId)
            .then(function (products) {
                res.json(products);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllOrdersForEvent(req, res) {
        var eventId = req.params.eventId;
        eventModel.findAllOrdersForEvent(eventId)
            .then(function (orders) {
                res.json(orders);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findEventById(req, res) {
        var eventId = req.params.eventId;
        eventModel.findEventById(eventId)
            .then(function (event) {
                res.json(event);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function updateEvent(req, res) {
        var eventId = req.params.eventId;
        var newEvent = req.body;
        eventModel.updateEvent(eventId, newEvent)
            .then(function (event) {
                res.json(event);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteEvent(req, res) {
        var eventId = req.params.eventId;
        eventModel.deleteEvent(eventId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function addGuest(req, res) {
        var eventId = req.params.eventId;
        var guestId = req.params.guestId;
        eventModel.addGuest(eventId, guestId)
            .then(function (event) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function addOrder(req, res) {
        var eventId = req.params.eventId;
        var orderId = req.params.orderId;
        eventModel.addOrder(eventId, orderId)
            .then(function (event) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function addProduct(req, res) {
        var eventId = req.params.eventId;
        var productId = req.params.productId;
        eventModel.addProduct(eventId, productId)
            .then(function (event) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

};