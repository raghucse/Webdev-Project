
(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService, $rootScope) {
        var vm = this;

        //Event Handlers
        vm.register = register;

        function init() {
        }
        init();

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
