'use strict';

(function (angular) {

  angular
    .module('ne.views.PostModule')
    .config(PostsViewConfig);

  PostsViewConfig.$inject = ['$stateProvider'];

  function PostsViewConfig($stateProvider) {

    $stateProvider.state('PostsView', {
      url: '/posts/:id?searchType',
      templateUrl: 'modules/views/post/templates/post.html',
      controller: 'PostViewController',
      onEnter: PostsViewConfigEnter,
      authRequired: true
    });
  }

  PostsViewConfigEnter.$inject = ['$timeout', '$location', '$uiViewScroll'];

  function PostsViewConfigEnter($timeout, $location, $uiViewScroll) {
    $timeout(function () {
      var anchorElement = angular.element('#' + $location.hash());
      if (anchorElement.length > 0) {
        $uiViewScroll(anchorElement);
      }
    }, 500);
  }

})
(angular);
