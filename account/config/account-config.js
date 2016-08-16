'use strict';

(function (angular) {

  angular
    .module('ne.views.AccountModule')
    .config(AccountConfig);

  AccountConfig.$inject = ['$stateProvider'];

  function AccountConfig($stateProvider) {

    $stateProvider.state('account', {
      abstract:true,
      templateUrl: 'modules/views/account/templates/account.html',
      controller: 'AccountController',
      controllerAs: 'Account',
      label: 'User Account',
      authRequired: true
    }).state('account.settings', {
      authRequired: true,
      url: '/account',
      templateUrl: 'modules/views/account/templates/settings.html'
    }).state('unsubscribe', {
      authRequired: false,
      url: '/unsubscribe/:truid?timestamp&token',
      templateUrl: 'modules/views/account/templates/unsubscribe.html',
      controller: 'UnsubscribeController',
      controllerAs: 'vm'
    });
  }
})(angular);
