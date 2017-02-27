'use strict';
var yii2AngApp_tree = angular.module('yii2AngApp.tree', ['ngRoute']);

yii2AngApp_tree.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/tree/index', {
            templateUrl: 'views/tree/index.html',
            controller: 'treeindex'
        })
        .otherwise({
            redirectTo: '/tree/index'
        });
}]);

yii2AngApp_tree.controller('treeindex', ['$scope', '$http',
        function($scope,$http) {
            $scope.message = 'Это страница с деревом элементов';
            $scope.handleEvent = function(event){
                console.log(event);
                $scope.type = 'Kzkkzk';
            }
        }]);

yii2AngApp_tree.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});