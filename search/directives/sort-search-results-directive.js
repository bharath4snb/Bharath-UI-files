'use strict';

(function(angular) {
  angular
    .module('ne.views.SearchModule')
    .directive('neSearchSort', searchSortDDirective);

  function searchSortDDirective() {
    return {
      scope: {},
      bindToController: {
        aggType: '=',
        onSort: '=',
        buttonText: '=',
        orderFilter: '='
      },
      restrict: 'AE',
      templateUrl: 'modules/views/search/templates/search-dropdown.html',
      controllerAs: 'vm',
      controller: sortSearchResultsController
    };
  }

  sortSearchResultsController.$inject = ['$scope', 'FIELDS'];

  function sortSearchResultsController($scope, FIELDS) {
    var vm = this; // jshint ignore:line
    vm.opts = [];

    parseRefineOpts();

    function parseRefineOpts() {
      var searchType = vm.aggType ? vm.aggType : 'ALL';
      var keys = Object.keys(FIELDS.SORT_RESULTS[searchType]);
      var refines = FIELDS.SORT_RESULTS[searchType];
      vm.opts = [];
      for (var i = 0; i < keys.length; i += 1) {
        vm.opts.push(refines[keys[i]]);
        if (refines[keys[i]].val === vm.orderFilter) {
          vm.buttonText = refines[keys[i]].sortText;
        }
      }
    }

    vm.sortElements = function(sortText, sort, type) {
      vm.buttonText = sortText;
      vm.onSort(sort, type);
    };

    $scope.$watch(angular.bind(vm, function() {
      return vm.aggType;
    }), function(newVal, oldVal) {
      if (newVal !== oldVal) {
        parseRefineOpts();
      }
    });
  }
})(angular);
