'use strict';

(function (angular) {
  angular
  .module('ne.views.BridgeModule').controller('bridgeController', bridgeController);

  bridgeController.$inject = ['$log', '$state', '$rootScope'];

  function bridgeController($log, $state, $rootScope) {
    var previous = $rootScope.previousState();
    $state.go(previous);
  }
})(angular);