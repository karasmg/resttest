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
    }])


function closest(e, className) {
    if (e.nodeName == "HTML") {
        return {};
    } else if (e.className.indexOf(className) !== -1) {
        return e;
    } else {
        return closest(e.parentNode, className);
    }
};

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
}])
