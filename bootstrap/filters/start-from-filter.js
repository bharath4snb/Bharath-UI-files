'use strict';

// @TODO Remove this filter and use the Angular limitTo filter (https://docs.angularjs.org/api/ng/filter/limitTo)

(function () {

  angular
    .module('ne')
    .filter('startFrom', startFrom);

  startFrom.$inject = ['$log'];

  function startFrom($log) {

    return startFromFilter;

    function startFromFilter(input, startFrom) {

      startFrom = startFrom || 0;

      if (!angular.isArray(input)) {
        $log.warn('startFrom filter should be used with an array.');
        return input;

      } else {
        return input.slice(startFrom);

      }

    }
  }

})();