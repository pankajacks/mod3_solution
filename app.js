(function(){
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems',FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;

        ctrl.searchTerm = "";

        ctrl.search = function() {
            if (ctrl.searchTerm !== "") {
                var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
                promise.then(function (response) {
                    ctrl.found = response;
                    // console.log("ToTal Item Found: ", ctrl.found.length);
                    // console.log("Item List: ", ctrl.found);
                })
                .catch(function (error) {
                    console.log("Something went terribly wrong.", error);
                });
            } else {
                ctrl.found = [];
            }
        }

        ctrl.remove = function(index) {
            ctrl.found.splice(index,1);
        }
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;
        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
            }).then(function(response){
                var data = response.data.menu_items;
                var foundItems = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push({
                            name: data[i].name, 
                            shortName: data[i].short_name, 
                            description: data[i].description
                        });
                    }
                }
                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'A',
            templateUrl:'FoundItems.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'fictrl',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var fictrl = this;
        fictrl.isItemFound = function() {
            return fictrl.foundItems===undefined || fictrl.foundItems.length > 0;
        }
    }
}());