/**
 * Created by raghu on 2/8/2017.
 */
module.exports =  function(app, ShoppingModel) {
    app.post("/api/host/:userId/shopping/add", addItem);
/*    app.get("/api/service/:serviceId", findServiceById);
    app.put("/api/service/:serviceId", updateService);
    app.delete("/api/service/:serviceId", deleteService);
    app.post("/api/vendor/:vendorId/service", createService);
    app.put("/api/service/:serviceId/page/:pageId", updatePage);*/

    function addItem(req, res) {
        var itemf = req.body;
        var userId = req.params.userId;

        var iteminfo = {_user: userId, item: itemf };

        ShoppingModel.addItemForUser(iteminfo)
            .then(function (service) {
                res.json(service);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function findAllServicesForVendor(req, res) {
        var vendorId = req.params.vendorId;
        console.log(vendorId);
        ServiceModel.findAllServicesForVendor(vendorId)
            .then(function (services) {
                res.json(services);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findServiceById(req, res) {
        var serviceId = req.params.serviceId;
        ServiceModel.findServiceById(serviceId)
            .then(function (service) {
                res.json(service);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function updateService(req, res) {
        var serviceId = req.params.serviceId;
        var service = req.body;
        ServiceModel.updateService(serviceId, service)
            .then(function (service) {
                res.json(service);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function deleteService(req, res) {
        var serviceId = req.params.serviceId;
        ServiceModel.deleteService(serviceId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function updatePage(req, res) {
        var serviceId = req.params.serviceId;
        var pageId = req.params.pageId;

        ServiceModel.updatePage(serviceId, pageId)
            .then(function (service) {
                res.send(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }
}

