(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController);

    function profileController(UserService, $routeParams, $location) {
        var vm = this;
        var userID = $routeParams['uid'];

        //event handlers
        vm.update = update;
        vm.logout = logout;

        function init() {
            var promise = UserService.findUserById(userID);
            promise.success(function (user) {
               vm.user = user;
            });
        }
        init();

        function update(newUser) {
            UserService
                .updateUser(userID, newUser)
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
