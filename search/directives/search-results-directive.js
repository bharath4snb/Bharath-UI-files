'use strict';
(function (angular) {
  angular
    .module('ne.views.SearchModule')
    .directive('neSearchResults', searchResultDirective);

  function searchResultDirective() {
    return {
      scope: {},
      bindToController: {
        results: '=',
        render: '@',
        loadMore: '=',
        isBusy: '='
      },
      restrict: 'AE',
      templateUrl: 'modules/views/search/templates/search-results.html',
      controller: searchResultController,
      controllerAs: 'vm'
    };
  }
  function searchResultController() {
    var vm = this; // jshint ignore:line
    if (vm.results !== undefined) {
      vm.render = true;
    }

    vm.getMore = function() {
      vm.loadMore();
    };
  }
})(angular);