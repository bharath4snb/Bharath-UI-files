'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .controller('WatchListController', WatchListController);

  WatchListController.$inject = ['WatchlistDetailsData'];

  function WatchListController(WatchlistDetailsData) {

    var vm = this;

    vm.WatchlistDetailsData = WatchlistDetailsData;

  }

})(angular);
