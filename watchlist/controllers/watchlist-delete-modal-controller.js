'use strict';

(function (angular) {
  angular
    .module('ne.views.WatchListModule')
    .controller('deleteWatchlistController', deleteWatchlistController);

  deleteWatchlistController.$inject = ['$modalInstance'];

  function deleteWatchlistController($modalInstance) {
    var vm = this; // jshint ignore:line

    vm.close = function() {
      $modalInstance.close('Ok');
    };

    vm.delete = function() {
      $modalInstance.close('delete');
    };
  }
})(angular);
