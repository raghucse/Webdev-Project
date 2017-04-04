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
                .then(function (response) {
                if(response){
                    user = response.data;
                    if(user[0]){
                        $rootScope.currentUser = user[0];
                        $location.url("/host/" + user[0]._id);
                    }
                    else{
                        vm.error = "User not found";
                    }
                }

            });
        }
    }

})();
