(function () {
    angular
        .module("WebAppMaker")
        .controller("HomeController", homeController);

    function homeController(UserService, $location, $rootScope, VendorService) {
        var vm = this;

        //event handlers
        vm.login = login;
        vm.register = register;
        vm.vendorlogin = vendorlogin;
        vm.vendorregister = vendorregister;
        vm.refreshData = refreshData;

        function init() {
            $('#userlogin').validator();
            $('#vendorlogin').validator();
            vm.user= undefined;
            vm.vendor = undefined;
            vm.error = undefined;
            vm.passworderror = undefined;
        }
        init();

        function refreshData() {
            init();
        }

        function login(user) {
            UserService
                .login(user)
                .then(function (response) {
                    if(response){
                        var user1 = response.data;
                        if(user1[0]){
                            $rootScope.currentUser = user1[0];
                            if(!user1[0].type)
                                $location.url("/host/" + user1[0]._id + "/event");
                            else
                                $location.url("/admin/" + user1[0]._id);
                        }
                        else{
                            vm.error = "User not found";
                        }
                    }

                }, function (err) {
                    vm.error = "User not found";
                });
        }

        function register(user) {
            if (user && user.username && user.password && user.password2) {
                if (user.password === user.password2) {
                    UserService
                        .findUserByUsername(user.username)
                        .then(function (user) {
                            user = user.data;
                            vm.error = "Username already taken";
                        }, function(err) {
                            UserService
                                .register(user)
                                .then(function (user) {
                                    user = user.data;
                                    $location.url("/host/" + user._id + "/event");
                                },function (err) {
                                    vm.error = "User Registration Failed";
                                })
                        })
                }
                else {
                    vm.passworderror = "Password and Verify password must match"
                }
            }
        }


        function vendorlogin(vendor) {
            var promise = VendorService
                .login(vendor.vendorname, vendor.password);
            promise.then(function(vendor){
                vendor = vendor.data;
                if(vendor[0]) {
                    $location.url("/vendor/"+vendor[0]._id + "/service");
                } else {
                    vm.error = "Vendor not found";
                }
            });
        }



        function vendorregister() {
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
