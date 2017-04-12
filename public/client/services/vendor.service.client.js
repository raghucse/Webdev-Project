/**
 * Created by raghu on 2/8/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("VendorService", VendorService);

    function VendorService($http) {
        var api = {
            "createVendor": createVendor,
            "findVendorById": findVendorById,
            "findVendorByVendorname": findVendorByVendorname,
            "findVendorByCity" : findVendorByCity,
            "login": login,
            "logout":logout,
            "findVendorByCredentials": findVendorByCredentials,
            "updateVendor": updateVendor,
            "deleteVendor": deleteVendor,
            "register": register,
            "updateService":updateService,
            "findAllVendors":findAllVendors
        };
        return api;

        function login(username, password) {
            return $http.post("/vendor/login?username="+username+"&password="+password);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function register(vendor) {
            return $http.post("/api/register", vendor);
        }

        function createVendor(newVendor) {
            return $http.post("/api/vendor", newVendor);
        }

        function findVendorById(vendorId) {
            return $http.get("/api/vendor/"+vendorId);
        }

        function findVendorByVendorname(vendorname) {
            return $http.get("/api/vendor?vendorname="+vendorname);
        }

        function findVendorByCity(cityname) {
            return $http.get("/api/vendor/city/name?name=" + cityname);
        }

        function findVendorByCredentials(vendorname, password) {
            return $http.post("/api/vendor?vendorname="+vendorname+"&password="+password);
        }

        function updateVendor(vendorId, newVendor) {
            return $http.put("/api/vendor/"+vendorId, newVendor);
        }

        function deleteVendor(vendorId) {
            return $http.delete("/api/vendor/"+vendorId);
        }

        function updateService(vendorId, serviceId) {
            return $http.put("/api/vendor/"+vendorId+"/service/"+serviceId);
        }

        function findAllVendors() {
            return $http.get("/api/vendor/");
        }

    }

})();