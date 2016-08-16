'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .filter('renameTypeWatchlist', renameTypeWatchlist);

  function renameTypeWatchlist() {
    return function(input) {
      switch (input) {
        case 'patents':
          return 'patent';
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
