'use strict';
// Ссылка на серверную часть приложения
var serviceBase = 'http://plut.local/';
// Основной модуль приложения и его компоненты
var yii2AngApp = angular.module('yii2AngApp', [
    'ngRoute',
    'site',
    'film'
]);
// рабочий модуль
var yii2AngApp_site = angular.module('site', ['ngRoute']);
var yii2AngApp_film = angular.module('film', ['ngRoute']);

yii2AngApp.config(['$routeProvider', function($routeProvider) {
    // Маршрут по-умолчанию
    $routeProvider.otherwise({redirectTo: '/site/index'});
}]);
