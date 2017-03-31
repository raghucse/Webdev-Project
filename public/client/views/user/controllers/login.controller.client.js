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
                if(user){
                    user = user.data;
                    $rootScope.currentUser = user[0];
                    //console.log(user[0]._id);
                    $location.url("/user/" + user[0]._id);
                }
                else{
                    vm.error = "User not found";
                }
            });
        }
    }

})();
