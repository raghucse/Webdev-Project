
module.exports = function (app, eventModel) {
    app.post("/api/user/:hostId/event", createEvent);
    app.get("/api/user/:hostId/event", findEventsForUser);
    app.get("/api/event/:eventId", findEventById);
    app.put("/api/event/:eventId", updateEvent);
    app.delete("/api/event/:eventId", deleteEvent);
    app.put("/api/event/:eventId/service/:serviceId", addService);
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
    
    function addService(req, res) {
        var eventId = req.params.eventId;
        var serviceId = req.params.serviceId;
        eventModel.addService(eventId, serviceId)
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