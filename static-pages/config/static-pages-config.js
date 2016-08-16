'use strict';

(function (angular) {
  angular
    .module('ne.views.StaticModule')
    .config(StaticConfigConstruct);

  StaticConfigConstruct.$inject = ['$stateProvider'];

  function StaticConfigConstruct($stateProvider) {
    $stateProvider
      .state('help', {
        url: '/help',
        controller: 'StaticPageCtrl',
        templateUrl: 'modules/views/static-pages/templates/help.html',
        label: 'Help',
        authRequired: true
      })
      .state('cookie-policy', {
        url: '/cookie-policy',
        templateUrl: 'modules/views/static-pages/templates/cookie-policy-view.html',
        label: 'Cookie Policy'
      })
      .state('privacy-statement', {
        url: '/privacy-statement',
        templateUrl: 'modules/views/static-pages/templates/privacy-statement-view.html',
        label: 'Privacy Statement'
      })
      .state('terms-of-use', {
        url: '/terms-of-use',
        templateUrl: 'modules/views/static-pages/templates/terms-of-use-view.html',
        label: 'Terms of Service'
      })
      .state('copyright', {
        url: '/copyright',
        templateUrl: 'modules/views/static-pages/templates/copyright.html',
        label: 'Copyright'
      });
  }

})(angular);
