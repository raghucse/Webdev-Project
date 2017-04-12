
module.exports =  function(app, ServiceModel) {
    app.get("/api/vendor/:vendorId/service", findAllServicesForVendor);
    app.get("/api/service/:serviceId", findServiceById);
    app.get("/api/service/city/name", findAllServicesInCity);
    app.put("/api/service/:serviceId", updateService);
    app.delete("/api/service/:serviceId", deleteService);
    app.post("/api/vendor/:vendorId/service", createService);
    app.put("/api/service/:serviceId/order/:orderId", updateOrder);

    function createService(req, res) {
        var newService = req.body;
        vendorId = req.params.vendorId;

        ServiceModel.createServiceForVendor(vendorId, newService)
            .then(function (service) {
                res.json(service);
            }, function (err) {
                res.sendStatus(500).send(err);
            })

    }

    function findAllServicesForVendor(req, res) {
        var vendorId = req.params.vendorId;
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

    function findAllServicesInCity(req, res) {
        var cityname = req.query.name;

        ServiceModel.findAllServicesInCity(cityname)
            .then(function (services) {
                res.json(services);
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

    function updateOrder(req, res) {
        var serviceId = req.params.serviceId;
        var orderId = req.params.orderId;

        ServiceModel.updateOrder(serviceId, orderId)
            .then(function (service) {
                res.send(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }
}

