(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "createUser" : createUser,
            "findUserById" : findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser,
            "addWebsite" : addWebsite,
            "login" : login,
            "findAllUsers" : findAllUsers,
            "logout" : logout,
            "register" : register
        };
        return api;

        function login(user) {
            return $http.post("/api/user/login/user", user);
        }

        function logout() {
            return $http.post("/api/user/logout");
        }

        function register(user) {
            return $http.post("/api/user/register", user);
        }

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/user/" + userId, newUser);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function addWebsite(userId, websiteId) {
            return $http.put("/api/user/"+userId+"/website/"+websiteId);
        }

        function findAllUsers() {
            return $http.get("/api/admin/allusers");
        }
    }

})();