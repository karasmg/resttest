'use strict';
yii2AngApp_site.config(['$locationProvider', '$routeProvider', function($locationProvider,$routeProvider) {
    alert('frgt');
      //  $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/site/index', {
                templateUrl: 'views/site/index.html',
                controller: 'index'
            })
            .when('/site/about', {
                templateUrl: 'views/site/about.html',
                controller: 'about'
            })
            .when('/site/contact', {
                templateUrl: 'views/site/contact.html',
                controller: 'contact'
            })
            .otherwise({
                redirectTo: '/site/index'
            });
        $locationProvider.html5Mode(true);
    }])
    .controller('index', ['$scope', '$location', '$routeParams', '$http', function($scope, $location, $routeParams, $http) {
        // Сообщение для отображения представлением
        $scope.message = 'Вы читаете главную страницу приложения. ';
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    }])
    .controller('about', ['$scope', '$location', '$routeParams', '$http', function($scope, $location, $routeParams, $http) {
        // Сообщение для отображения представлением
        $scope.message = 'Это страница с информацией о приложении.';
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    }])
    .controller('contact', ['$scope', '$location', '$routeParams', '$http', function($scope, $location, $routeParams, $http) {
        // Сообщение для отображения представлением
        $scope.message = 'Пишите письма. Мы будем рады!.';
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    }]);