/**
 * Created by raghu on 2/8/2017.
 */
module.exports =  function(app, ShoppingModel) {

    app.post("/api/host/:hostId/event/:eventId/shopping/add", addItem);
    app.get("/api/event/:eventId/shopping", findAllItemsForEvent);
    app.get("/api/host/:hostId/shopping/:itemId", findItemsByItemId);
    app.put("/api/shopping/:id/quantity/:quantity", updateItemQuantity);
    app.delete("/api/shopping/delete/:id", deleteItem);
    app.put("/api/guest/:guestId/shopping/:id", claimItem);
    app.get("/api/shopping/:id", findItemById);

    function addItem(req, res) {
        var itemf = req.body;
        var hostId = req.params.hostId;
        var eventId = req.params.eventId;
        var itemPrice = itemf.salePrice;
        var quantity = itemf.quantity;
        var itemId = itemf.itemId;
        var iteminfo = {_host: hostId, item: itemf, itemId: itemId, _event: eventId, itemPrice: itemPrice, quantity: quantity};

        ShoppingModel.addItemForUser(iteminfo)
            .then(function (service) {
                res.json(service);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function findAllItemsForEvent(req, res) {
        var eventId = req.params.eventId;
        ShoppingModel.findAllItemsForEvent(eventId)
            .then(function (items) {
                res.json(items);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findItemsByItemId(req, res) {
        var itemId = req.params.itemId;
        var hostId = req.params.hostId;
        ShoppingModel.findItemsByItemId(itemId, hostId)
            .then(function (item) {
                res.json(item);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function updateItemQuantity(req, res) {
        var id = req.params.id;
        var quantity = req.params.quantity;
        ShoppingModel.updateItemQuantity(id, quantity)
            .then(function (item) {
                res.json(item);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function claimItem(req, res) {
        var id = req.params.id;
        var guestId = req.params.guestId;
        var guest = req.body;
        ShoppingModel.claimItem(id, guestId, guest)
            .then(function (item) {
                ShoppingModel.findItemById(id)
                    .then(function (item) {
                        res.json(item);
                    }, function (err) {
                        res.sendStatus(500).send(err);
                    })
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function deleteItem(req, res) {
        var id = req.params.id;
        ShoppingModel.deleteItem(id)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function findItemById(req, res) {
        var id = req.params.id;
        ShoppingModel.findItemById(id)
            .then(function (item) {
                res.json(item);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }
}

