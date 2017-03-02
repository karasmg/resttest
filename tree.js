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
        $scope.items = [
            { id: 1, name: 'First', childrens: [
                { id: 3, name: 'three', childrens: null },
                { id: 4, name: 'four', childrens: [
                    { id: 5, name: 'five', childrens: null }
                ]
                }
            ]
            },
            { id: 2, name: 'second', childrens: [] }
        ];
        $scope.say = function (str) {
            alert(str);
        }
        $scope.meee = function(nodes){
            $scope.nodes = nodes;
        }


        $scope.addNode = function(){

        }

        $scope.delNode = function(){

        }


        $scope.nodes = [
            {
                id: 0,
                text: "Родительский узел",
                nodes: [
                    {
                        id: 1,
                        text: "узел1",
                        nodes: [
                            {
                                id: 2,
                                text: "узел2"
                            }
                        ]
                    },
                    {
                        id: 3,
                        text: "узел3",
                        nodes: [
                            {
                                id: 4,
                                text: "узел4"
                            },
                            {
                                id: 5,
                                text: "узел5",
                                nodes: [
                                    {
                                        id: 6,
                                        text: "узел6"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

    }]);

yii2AngApp_tree.directive('ngNode', ['$document', '$compile', function($document, $compile) {

    return function(scope, element, attrs) {
        element.on('contextmenu', function(event) {
            event.preventDefault();
            event.stopPropagation();
            //Блокируем создание многих высплывающих окон
            if(document.getElementsByClassName('dropdown-menu').length !== 0)
                return false;
            var coord = {
                top: element[0].offsetTop,
                left: element[0].offsetLeft,
                height: element[0].offsetHeight,
                width: element[0].offsetWidth
            };
            //Выводим контекстное меню
            var context_menu = '<ul class="dropdown-menu" style = "">'+
                                    '<li><a href="javascript:void(0)" ng-click="add_node()">Добавить</a></li>'+
                                    '<li><a href="javascript:void(0)" ng-click="move_node()">Переместить</a></li>'+
                                    '<li><a href="javascript:void(0)" ng-click="del_node()">Удалить</a></li>'+
                                '</ul>';
            context_menu = angular.element(context_menu);
            context_menu.css({
                top: (coord.top+coord.height)+"px",
                left: (coord.left+coord.width/2)+"px",
                display: "block"
            });
            element.append(context_menu);
            $compile(context_menu)(scope);
            var menu_remove = function(){
                context_menu.remove();
                event.stopPropagation();
                $document.off('click', menu_click);
            };
            var menu_click = function(event){
                console.log('body_click');
                if (closest( event.target, "dropdown-menu").nodeName !== undefined) return;
                menu_remove();
            }
            $document.on('click', menu_click);
            scope.add_node = function(){
                //scope.meee(nooo);
                console.log('add_node', element);
                menu_remove();
            }
            scope.del_node = function(){
                console.log('del_node');
                menu_remove();
            }
            scope.move_node = function(){
                console.log('move_node');
                menu_remove();
            }
        });
    };
}]);

//объявляет дерево
yii2AngApp_tree.directive('myTreeview', [function () {
        return {
            restrict: 'A',
            priority: 1001,
            controller: 'treeindex',
            compile: function (element, tAttrs) {
                //создаем шаблон для дочерних элементов
                angular.forEach(angular.element(element.find('li')), function (item) {
                    var el = angular.element(item);

                    el.prepend(angular.element('<i />').addClass('normal').attr('ng-hide', 'config.hasChildrens'));
                    el.prepend(angular.element('<i />').addClass('expanded').attr('ng-show', 'config.hasChildrens && !config.collapsed').attr('ng-click', 'collapse(config)'));
                    el.prepend(angular.element('<i />').addClass('collapsed').attr('ng-show', 'config.hasChildrens && config.collapsed').attr('ng-click', 'collapse(config)'));
                });

                var itemTemplate = element.html();
                var template = angular.element('<ul ng-hide="config.collapsed" />').append(itemTemplate)[0].outerHTML;

                return function (scope, element, attrs, ctrl) {
                    //делаем доступным шаблон для дочерней дерективы
                    ctrl.Template = template;
                    element.addClass('treeview');
                    scope.collapse = function (config) {
                        config.collapsed = !config.collapsed;
                    }

                }
            }
        }
    } ])

    //достраивает дочерние элемент
    .directive('myTreeviewChilds', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            require: '^myTreeview',
            link: function (scope, element, attrs, ctrl) {
                //достаем дочерние элементы
                var items = $parse(attrs.myTreeviewChilds)(scope);
                var newScope = scope.$new();
                newScope.items = items
                scope.config = {};
                if (items != null && items.length > 0) {
                    newScope.$parent.config.hasChildrens = true;
                    newScope.$parent.config.collapsed = false;
                    element.append($compile(ctrl.Template)(newScope));
                }
                else {
                    newScope.$parent.config.hasChildrens = false;
                    newScope.$parent.config.collapsed = false;
                }
            }
        }
    } ]);

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
    if (e.nodeName == "HTML") {
        return {};
    } else if (e.className.indexOf(className) !== -1) {
        return e;
    } else {
        return closest(e.parentNode, className);
    }
};