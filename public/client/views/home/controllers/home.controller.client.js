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
        vm.closeallmodalsLogin = closeallmodalsLogin;
        vm.closeallmodalsAbout = closeallmodalsAbout;

        function init() {
            $('#userlogin').validator();
            $('#vendorlogin').validator();
            $('#registerform').validator();
            $('#registerformV').validator();
            vm.user= undefined;
            vm.vendor = undefined;
            vm.error = undefined;
            vm.passworderror = undefined;
        }
        init();

        function refreshData() {
            init();
        }

        function closeallmodalsLogin() {
            $('#about').modal('hide');
            $('#userlogin').modal('hide');
            $('#vendorlogin').modal('hide');
            $('#userregister').modal('hide');
            $('#vendorregister').modal('hide');
            $('#myNavbar').collapse('hide');
        }

        function closeallmodalsAbout() {
            $('#login').modal('hide');
            $('#userlogin').modal('hide');
            $('#vendorlogin').modal('hide');
            $('#userregister').modal('hide');
            $('#vendorregister').modal('hide');
            $('#myNavbar').collapse('hide');
        }

        function login(user) {
            UserService
                .login(user)
                .then(function (response) {
                    if(response){
                        var user1 = response.data;
                        if(user1[0]){
                            $rootScope.currentUser = user1[0];
                            if(user1[0].type == "USER")
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
                        .findUserByUsername(vm.user.username)
                        .then(function (user) {
                            user = user.data;
                            if (user[0]) {
                                vm.error = "sorry that username is taken";
                            }
                            else {
                                UserService
                                    .register(vm.user)
                                    .then(function (user) {
                                        user = user.data;
                                        $location.url('/host/' + user._id+'/event');
                                    }, function (err) {
                                        vm.error = 'sorry could not register';
                                    })
                            }
                        }, function (err) {
                            vm.error = 'sorry could not register';
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
                    vm.Verror = "Vendor not found";
                }
            }, function (err) {
                vm.Verror = "Vendor not found";
            }).catch(function (err) {
                vm.Verror = "Vendor not found";
            })

        }



        function vendorregister() {

            if (vm.vendor.password === vm.vendor.password2V) {
                VendorService
                    .findVendorByVendorname(vm.vendor.vendorname)
                    .then(function (vendor) {
                        vendor = vendor.data;
                        if (vendor[0]) {
                            vm.error = "sorry that vendorname is taken";
                        }
                        else {
                            VendorService
                                .register(vm.vendor)
                                .then(function (vendor) {
                                    vendor = vendor.data;
                                    $location.url('/vendor/' + vendor._id+'/service');
                                }, function (err) {
                                    vm.error = 'sorry could not register';
                                })
                        }
                    }, function (err) {
                        vm.error = 'sorry could not register';
                    })
            }
            else {
                vm.passworderrorV = "Password and Verify password must match"
            }
        }
    }

})();
