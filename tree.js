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

        $scope.nodes1 = [
            {
                n_id: 0,
                n_parent: 0,
                n_text: 'Родительский узел'
            },
            {
                n_id: 1,
                n_parent: 0,
                n_text: 'узел 1'
            }
        ]

        $scope.nodes = [
            {
                id: 0,
                text: "Родительский узел",
                nodes: [
                    {
                        id: 1,
                        parent: 0,
                        text: "узел1",
                        nodes: [
                            {
                                id: 2,
                                parent: 1,
                                text: "узел2"
                            }
                        ]
                    },
                    {
                        id: 3,
                        parent: 0,
                        text: "узел3",
                        nodes: [
                            {
                                id: 4,
                                parent: 3,
                                text: "узел4"
                            },
                            {
                                id: 5,
                                parent: 3,
                                text: "узел5",
                                nodes: [
                                    {
                                        id: 6,
                                        parent: 5,
                                        text: "узел6"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        $scope.addNode = function(id){
            var node = $scope.findNode(id);
            if(node.nodes === undefined)
                node.nodes = [];
            node.nodes.push({
                id: $scope.getLastId(),
                parent: id,
                text: 'Узел',
                nodes: []
            });
        }

        $scope.delNode = function(parent, id){
            var node = $scope.findNode(parent);
            for(var i=0; i < node.nodes.length; i++){
                if(node.nodes[i].id == id){
                    node.nodes.splice(i,1);
                }
            }
        }


        $scope.getLastId = function(){
            var last=0;
            recurs($scope.nodes);
            last++;
            return last;
            function recurs(nodes){
                var l = nodes.length;
                for(var i=0; i<l; i++ ){
                    if(nodes[i].id > last)
                        last =  nodes[i].id;
                    if(nodes[i].nodes !== undefined)
                        recurs(nodes[i].nodes);
                }
            }
        }


        $scope.findNode = function(id){
            var rez={};
            recurs($scope.nodes);
            return rez;
            function recurs(nodes){
                var l = nodes.length;
                for(var i=0; i<l; i++ ){
                    if(nodes[i].id == id) {
                        rez =  nodes[i];
                        return;
                    }
                    if(nodes[i].nodes !== undefined)
                        recurs(nodes[i].nodes);
                }
            }
        }
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
                top: (coord.top+15)+"px",
                left: (coord.left+coord.width/2)+"px",
                display: "block"
            });
            element.append(context_menu);
            $compile(context_menu)(scope);

            //Удаление меню с экрана
            var menu_remove = function(){
                context_menu.remove();
                event.stopPropagation();
                $document.off('click', menu_click);
            };

            //Клик вне меню
            var menu_click = function(event){
                if (closest( event.target, "dropdown-menu").nodeName !== undefined) return;
                menu_remove();
            }
            $document.on('click', menu_click);

            //Клик по пункту Добавить
            scope.add_node = function(){
                scope.addNode(attrs.id);
                menu_remove();
            }

            //Клик по пункту Удалить
            scope.del_node = function(){
                scope.delNode(attrs.parent, attrs.id);
                menu_remove();
            }

            //Клик по пункту Переместить
            scope.move_node = function(){
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