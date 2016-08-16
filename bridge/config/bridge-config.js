'use strict';

(function (angular) {
  angular
  .module('ne.views.BridgeModule').config(bridgeConfig);

  bridgeConfig.$inject = ['$stateProvider'];
  function bridgeConfig($stateProvider) {
    $stateProvider.state('bridge', {
      url: '/bridge',
      authRequired:true,
      controller: 'bridgeController',
      resolve: { bridgeUrl: ['LoginService', function bridgeResolve(LoginService) {
        LoginService.bridgeFromApp();
      }] }
    });
  }

})(angular);