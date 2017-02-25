'use strict';
// Ссылка на серверную часть приложения
var serviceBase = 'http://yii2-ang.local/';
// Основной модуль приложения и его компоненты
var yii2AngApp = angular.module('yii2AngApp', [
    'ngRoute',
    'yii2AngApp.site',
    'yii2AngApp.film'
]);

yii2AngApp.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    // Маршрут по-умолчанию
    $routeProvider.otherwise({redirectTo: '/site/index'});
}]);
