(function () {
    angular
        .module("WebAppMaker")
        .controller("HomeController", homeController);

    function homeController(UserService, $location, $rootScope) {
        var vm = this;

        //event handlers
        vm.login = login;
        vm.register = register;

        function init() {
        }
        init();

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
    }

})();
