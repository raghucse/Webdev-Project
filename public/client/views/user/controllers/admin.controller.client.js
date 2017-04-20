


(function() {
    var app = angular
        .module("WebAppMaker");
    app.controller("AdminHomeController", AdminHomeController);

    function AdminHomeController($routeParams, VendorService, $location, UserService) {
        var vm = this;
        vm.aid = $routeParams["aid"];

        vm.getAllUsers = getAllUsers;
        vm.getAllVendors = getAllVendors;
        vm.findVendorByUserName = findVendorByUserName;
        vm.dropChange = dropChange;
        vm.search = search;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
        }
        init();

        function getAllUsers() {
            UserService.findAllUsers()
                .then(function (users) {
                    vm.users = users.data;
                })
        }

        function getAllVendors() {
            VendorService.findAllVendors()
                .then(function (vendors) {
                    vm.vendors = vendors.data;
                })
        }

        function search() {
            vm.user = undefined;
            vm.noQuery = undefined;
            vm.deleteSuccess = undefined;
            vm.deleteError = undefined;

            if(!vm.userType) {
                vm.noType = "Please select account type";
            }
            else if(!vm.userName) {
                vm.noQuery = "Please enter the query";
            }
            else {
                if (vm.userType == "user")
                    findUserByUserName();
                else
                    findVendorByUserName();
            }
        }

        function findVendorByUserName() {
            vm.vendorNfound = undefined;
            vm.userNfound = undefined
            VendorService.findVendorByVendorname(vm.userName)
                .then(function (vendor) {
                    vm.user = vendor.data[0];
                    if(vm.user){
                        vm.vendor = true;
                        vm.user.name = vm.user.lastName +" ,"+ vm.user.firstName;

                    }else {
                        vm.vendorNfound = "User not found";
                    }

                }, function (err) {
                    vm.vendorNfound = "User not found";
                })
        }


        function findUserByUserName() {
            vm.vendorNfound = undefined;
            vm.userNfound = undefined;
            UserService.findUserByUsername(vm.userName)
                .then(function (user) {
                    vm.user = user.data[0];
                    if(!user.data[0]){
                        vm.userNfound = "User not found";
                    }
                    else
                    {
                        vm.vendor = false;
                        vm.user.name = vm.user.lastName +" ,"+ vm.user.firstName;
                    }
                },  function (err) {
                    vm.userNfound = "User not found";
                })
        }

        function deleteUser() {
            vm.deleteSuccess = undefined;
            vm.deleteError = undefined;

            if(vm.vendor)
                deleteVendorById();
            else
                deleteUserById();
        }

        function deleteUserById() {
            UserService.deleteUser(vm.user._id)
                .then(function (status) {
                    vm.deleteSuccess = "Deleted Successfully"
                    vm.user = undefined;
                },function () {
                    vm.deleteError = "Error While Deleting"
                })
        }

        function deleteVendorById() {
            VendorService.deleteVendor(vm.user._id)
                .then(function (status) {
                    vm.deleteSuccess = "User Deleted successfully"
                    vm.user = undefined;
                },function () {
                    vm.deleteError = "Error While deleting user"
                })
        }

        function dropChange() {
            vm.noType = undefined;
        }

        function logout() {
            $('#myNavbar').collapse('hide');
            UserService
                .logout()
                .then(function(response) {
                    $location.url("/home");
                });
        }

    }

})();