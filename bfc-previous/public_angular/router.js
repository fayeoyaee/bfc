var app = angular.module("userApp", ["ngRoute","react"])

app.config(function($routeProvider) {
    $routeProvider
    .when("/home", {
        templateUrl : "home.html",
        controller : "homeController"
    })
    .when("/shopping-cart", {
        templateUrl : "shopping-cart.html",
        controller: "shopping-cartController"
    })
    .when("/register", {
        templateUrl : "register.html",
        controller: "registerController"
    })
    .when("/login", {
        templateUrl : "login.html",
        controller: "loginController"
    })
    .when("/logout", {
        templateUrl : "logout.html",
        controller: "logoutController"
    })
    .when("/profile", {
        templateUrl : "profile.html",
        controller: "profileController"
    })
    .when("/profile/:userId", {
        templateUrl : "profile.html",
        controller: "profileController"
    })
    .when("/product/:productId", {
        templateUrl : "product.html",
        controller: "productController"
    })
    .when("/addProduct", {
        templateUrl : "addProduct.html",
        controller: "addProductController"
    })
})

app.controller("productController", function($scope, $routeParams){
    $scope.id = $routeParams.productId
})

app.controller("shopping-cartController", function($scope){
})

app.controller("registerController", function($scope, $http, $location){
    $scope.register = function register(){
        $http.post("/register", $scope.user)
        .then(function successCallback(res){
            console.log(res.data.message)
            $location.url("/login");
        }, function errorCallback(res){
            console.log(res.data.message)
        })
    };
})

app.controller("addProductController", function($scope, $http){
    $scope.register = function register(){
        $http.post("/addProduct", $scope.product)
        .then(function successCallback(res){
            console.log(res.data.message)
        }, function errorCallback(res){
            console.log(res.data.message)
        })
    };

})

app.controller("loginController", function($rootScope, $scope, $http, $location){
    $scope.login = function login(){
        $http.post("/login", $scope.user)
        .then(function successCallback(res){
            document.cookie = "username="+res.data.user.username;
            document.cookie = "userid="+res.data.user._id;
            $rootScope.currentUser = true
            console.log(res.data.message);
            // TODO: can be directed to home, shopping-cart, or profile
            // depending on the page visited before login
            $location.url("/profile/" + res.data.user._id);
        }, function errorCallback(res){
            window.alert(res.data.message)
        })
    }
})

app.controller("logoutController", function($rootScope, $timeout, $location){
    $timeout(function() {
        document.cookie = "username=";
        document.cookie = "userid=";
        $rootScope.currentUser = false
        $location.url('/home');
    }, 3000);

})

app.controller("profileController", function($rootScope, $scope, $http, $routeParams, $location, cookieService){
    if (cookieService.getCookie("username")) {
        if (!$routeParams.userId) {
            $location.url("/profile/" + cookieService.getCookie("userid"))
        }
        $rootScope.currentUser = true

        $http.get("/profile/"+cookieService.getCookie("userid"))
        .then(function successCallback(res){
            $scope.user = res.data.user 
        }, function errorCallback(res){
            console.log(res.data.message)
        })
    }
})

app.controller("homeController", function($scope, $http){
    $http.get("/home")
    .then(function successCallback(res){
        // $scope.product = {
        //     src: "product.png",
        //     description: "home",
        //     id: 1,
        // }
        $scope.product = res.data.products
    }, function errorCallback(res){
        console.log(res.data.message)
    })


})

app.factory('cookieService', function () {
    var service = {
        getCookie : getCookie
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
 
    return service;
  })