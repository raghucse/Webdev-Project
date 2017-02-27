
(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService) {
        var vm = this;

        //Event Handlers
        vm.register = register;


        function init() {
        }
        init();

        function register(user) {
             var newUser = UserService.createUser(user);

             $location.url("/user/" + newUser._id);
        }

    }
})();
