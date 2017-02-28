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
        $scope.add_node = function(){
            console.log('add_node');
        }
    }]);

yii2AngApp_tree.directive('ngNode', ['$document', '$compile', function($document, $compile) {
    return function(scope, element, attrs) {
        element.on('contextmenu', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var coord = {
                top: element[0].offsetTop,
                left: element[0].offsetLeft,
                height: element[0].offsetHeight,
                width: element[0].offsetWidth
            };
            //Выводим контекстное меню
            var context_menu = '<ul class="dropdown-menu" style = "">'+
                                    '<li><a href="javascript:void(0)" ng-click="add_node()">Добавить</a></li>'+
                                    '<li><a href="javascript:void(0)">Переместить</a></li>'+
                                    '<li><a href="javascript:void(0)">Удалить</a></li>'+
                                '</ul>';
            context_menu = angular.element(context_menu);
            context_menu.css({
                top: (coord.top+coord.height)+"px",
                left: (coord.left+coord.width/2)+"px",
                display: "block"
            });
            element.append(context_menu);
            $compile(context_menu)(scope);
            $document.find('body').on('click', function(event){
                console.log('body_click');
                if (closest( event.target, "dropdown-menu").nodeName !== undefined) return;
                context_menu.remove();
                event.stopPropagation();
            });

        });
    };
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



function closest(e, className) {
    if (e.nodeName == "BODY") {
        return {};
    } else if (e.className.indexOf(className) !== -1) {
        return e;
    } else {
        return closest(e.parentNode, className);
    }
};