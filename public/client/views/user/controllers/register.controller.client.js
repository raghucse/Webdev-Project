
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
                        .success(function (user) {
                            vm.error = "Username already taken";
                        })
                        .error(function () {
                            UserService
                                .register(user)
                                .then(function (response) {
                                    var user = response.data;
                                    $rootScope.currentUser = user;
                                    $location.url("/host/" + user._id);
                                })
                                .error(function () {
                                    vm.error = "User Registration Failed";
                                })
                        });
                }
                else {
                    vm.passworderror = "Password and Verify password must match"
                }
            }
        }

    }
})();
