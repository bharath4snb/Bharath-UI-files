'use strict';

(function (angular) {

  angular
    .module('ne.views.PostModule')
    .constant('POST_CONFIG', {
      POST_DETAILS_ENDPOINT: '/api/posts/post'
    });
})(angular);