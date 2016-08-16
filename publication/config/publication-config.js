'use strict';

(function (angular) {

  angular
    .module('ne.views.PublicationModule')
    .config(RecordviewConfig);

  RecordviewConfig.$inject = ['$stateProvider'];

  function RecordviewConfig($stateProvider) {

    $stateProvider.state('articleView', {
      url: '/wos/:id?searchType',
      templateUrl: 'modules/views/publication/templates/article.html',
      controller: 'RvCtrl',
      onEnter: recordViewOnEnter,
      authRequired: true
    });

    $stateProvider.state('patentView', {
      url: '/patents/:id?searchType',
      templateUrl: 'modules/views/publication/templates/patent.html',
      controller: 'patentCtrl',
      controllerAs: 'vm',
      onEnter: recordViewOnEnter,
      authRequired:true
    });
  }

  recordViewOnEnter.$inject = ['$timeout', '$location', '$uiViewScroll'];

  function recordViewOnEnter($timeout, $location, $uiViewScroll) {
    $timeout(function () {
      var anchorElement = angular.element('#' + $location.hash());
      if (anchorElement.length > 0) {
        $uiViewScroll(anchorElement);
      }
    }, 500);
  }

})
(angular);
