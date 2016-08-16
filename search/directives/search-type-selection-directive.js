'use strict';

(function (angular) {

  angular
    .module('ne.views.SearchModule')
    .directive('searchTypeSelector', searchTypeSelector);

  searchTypeSelector.$inject = ['CONFIG', '$compile'];

  function searchTypeSelector(CONFIG, $compile) {
    return {
      scope: {},
      bindToController: {
        searchType: '=',
        typeChange: '=',
        queryCounters: '=',
        isBusy: '='
      },
      replace: true,
      restrict: 'E',
      template: '<div></div>',
      link: linkFunction,
      controllerAs: 'vm',
      controller: searchTypeSelectorController
    };

    function linkFunction($scope, element, attrs, controller) {

      var types = Object.keys(CONFIG.SEARCH_TYPE_ENDPOINT);

      if (types.length > 0) {

        var button;
        var sideMenu = angular.element('<aside class="wui-side-menu">');
        var sideMenuList = angular.element('<ul class="wui-side-menu__list">');

        element.append(sideMenu);
        sideMenu.append(sideMenuList);

        angular.forEach(types, function(value) {

          var valueText = value.toLowerCase().replace(/^[a-z]/, function(str) {
            return str.toUpperCase();
          });

          button = angular.element(
            '<li class="wui-side-menu__list-item" ' + 'ng-class="{\'wui-side-menu__list-item--active\': vm.searchType === \'' + value + '\'}"' + '>' +
              '<a href class="wui-side-menu__link" ng-click="vm.updateSearchType(\'' + value + '\')">' +
                valueText + '<span class="wui-side-menu__badge"' +
                'ng-show="vm.showCounters">{{vm.buttonCount["' +
                valueText + '"] || 0 | number}}</span>' +
              '</a>' +
            '</li>');

          $compile(button)($scope);

          sideMenuList.append(button);

          $scope.$watch(angular.bind(controller, function() {
            return controller.queryCounters;
          }), function(newVal, oldVal) {
            if (newVal !== oldVal) {
              controller.showCounters = true;
              angular.forEach(newVal, function(value, key) {
                controller.buttonCount[key] = value;
              });
            }
          });
        });
      }
    }
  }

  searchTypeSelectorController.$inject = ['Analytics'];

  function searchTypeSelectorController(Analytics) {
    var vm = this; // jshint ignore:line
    vm.buttonCount = [];
    vm.showCounters = false;

    vm.updateSearchType = function(value) {
      if (vm.searchType === value) {
        return;
      } else {
        if (!vm.isBusy) {
          Analytics.trackEvent('searchresult-ck-searchtype', value);
          vm.typeChange(value);
        }
      }
    };
  }

})(angular);
