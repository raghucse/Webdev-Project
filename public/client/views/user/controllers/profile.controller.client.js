(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController);

    function profileController(UserService, $routeParams, $location, $rootScope) {
        var vm = this;
        vm.hostID = $routeParams['hid'];

        //event handlers
        vm.update = update;
        vm.logout = logout;

        function init() {
            var promise = UserService.findUserById(vm.hostID);
            promise.success(function (user) {
               vm.user = user;
            });
        }
        init();

        function update(newUser) {
            UserService
                .updateUser(vm.hostID, newUser)
                .success(function (updatedUser) {
                    if(updatedUser == null){
                        vm.error = "Unable to Update User";
                    }else{
                        vm.message = "User Successfully Updated";
                    }
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }
    }

    
})();
