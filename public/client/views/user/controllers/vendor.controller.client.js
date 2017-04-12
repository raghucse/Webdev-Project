/**
 * Created by raghu on 2/8/2017.
 */


(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("VendorLoginController", VendorLoginController);
    app.controller("VendorProfileController", VendorProfileController);
    app.controller("VendorRegisterController", VendorRegisterController);

    function VendorProfileController($routeParams, VendorService, $location) {
        var vm = this;
        vm.vendorId = $routeParams["vid"];
        vm.update =  update;
        vm.deleteVendor = deleteVendor;
        vm.logout = logout;

        function init() {
            var promise = VendorService.findVendorById(vm.vendorId);
            promise.then(function(vendor){
                vm.vendor = vendor.data;
            });
        }
        init();

        function update(vendor) {
            VendorService
                .updateVendor(vm.vendorId, vendor)
                .then(function (vendor) {
                    vm.message = "Vendor successfully updated";
                    vm.vendor = vendorSaved;
                }, function (vendor) {
                    vm.error = "Unable to update vendor";
                });
        }

        function logout() {
            VendorService
                .logout()
                .then(function (status) {
                    $location.url("/login");
                })
        }

        function deleteVendor(vendor) {
            var cfrm = confirm("Are you sure that you want to delete?")
            if(cfrm){
                VendorService
                    .deleteVendor(vendor._id)
                    .then(function () {
                        $location.url("/login");
                    },function () {
                        vm.error = "Unable to UnRegister Vendor";
                    });
            }
        }

    }

    function VendorLoginController(VendorService, $location) {
        var vm = this;
        vm.login = login;

        function init() {
        }
        init();

        function login(vendor) {
            var promise = VendorService
                .login(vendor.vendorname, vendor.password);
            promise.then(function(vendor){
                vendor = vendor.data;
                if(vendor[0]) {
                    $location.url("/vendor/"+vendor[0]._id);
                } else {
                    vm.error = "Vendor not found";
                }
            });
        }

    }

    function VendorRegisterController(VendorService, $location) {
        var vm = this;
        vm.register = register;

        function init() {
        }
        init();

        function register() {
            VendorService
                .findVendorByVendorname(vm.vendor.vendorname)
                .then(function (vendor) {
                    vendor = vendor.data;
                    if(vendor[0]) {
                        vm.error = "sorry that vendorname is taken";
                    }
                    else
                    {
                        VendorService
                            .register(vm.vendor)
                            .then(function(vendor){
                                vendor = vendor.data;
                                $location.url('/vendor/' + vendor._id);
                            }, function (err) {
                                vm.error = 'sorry could not register';
                            })
                    }
                },function(err){
                    vm.error = 'sorry could not register';
                })
        }
    }
})();