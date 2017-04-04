(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController);

    function loginController(UserService, $location, $rootScope) {
        var vm = this;

        //event handlers
        vm.login = login;

        function init() {
        }
        init();

        function login(user) {
            UserService
                .login(user)
                .then(function (user) {
                    user = user.data;
                    $rootScope.currentUser = user;
                if(user){
                    $location.url("/user/" + user._id);
                }
                else{
                    vm.error = "User not found";
                }
            });
        }
    }

})();
