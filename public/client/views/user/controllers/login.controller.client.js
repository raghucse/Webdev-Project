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
    }

})();
