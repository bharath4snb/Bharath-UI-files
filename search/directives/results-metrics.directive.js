'use strict';
(function (angular) {
  angular
    .module('ne.views.SearchModule')
    .directive('resultsMetrics', resultsMetricsDirective);

  function resultsMetricsDirective() {
    return {
      restrict: 'AE',
      templateUrl: 'modules/views/search/templates/results-metrics.html'
    };
  }
})(angular);