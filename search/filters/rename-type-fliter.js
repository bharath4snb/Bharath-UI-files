'use strict';

(function (angular) {

  angular
    .module('ne.views.SearchModule')
    .filter('renameType', renameType);

  function renameType() {
    return function(input) {
      switch (input) {
        case 'patents':
          return 'patent';
        case 'people':
          return 'person';
        case 'posts':
          return 'post';
        case 'wos':
          return 'article';
        default:
          return input;
      }
    };
  }

})(angular);
