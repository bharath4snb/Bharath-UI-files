
(function(angular) {
  'use strict';

  angular
    .module('ne.views.BridgeModule')
    .service('BridgeService', BridgeService);

  BridgeService.$inject = ['$log', '$http', '$q', 'CONFIG'];

  function BridgeService($log, $http, $q, CONFIG) {
    this.getBridge = function() {
      var deferred = $q.defer();
      $http.get(CONFIG.BRIDGE_URL)
        .success(function(data) {
          $log.info('Bridge Success', data);
          deferred.resolve(data);
        });
      return deferred.promise;
    };
  }
})(angular);