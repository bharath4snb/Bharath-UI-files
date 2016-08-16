'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .controller('WorkspaceController', WorkspaceController);

  WorkspaceController.$inject = ['$log', 'WatchlistData', 'Notification', 'WatchlistContainerService', 'Analytics', '$state'];

  function WorkspaceController($log, WatchlistData, Notification, WatchlistContainerService, Analytics, $state) {
    var vm = this;
    vm.results = [];
    vm.totalCount = 0;
    vm.publicCount = 0;
    vm.privateCount = 0;
    vm.createPanelIsVisible = false;
    vm.listType = 'All';
    vm.recordToUpdate = null;

    vm.sortables = [
      {
        label: 'Date (Newest)',
        value: '-modified'
      },
      {
        label: 'Date (Oldest)',
        value: '+modified'
      },
      {
        label: 'Name (A - Z)',
        value: '+containerName'
      },
      {
        label: 'Name (Z - A)',
        value: '-containerName'
      }

    ];

    vm.selectedSort = vm.sortables[0];

    WatchlistData.$promise.then(function (response) {

      if (response.containerWItems.length === 0) {
        vm.serverMsg = 'Add articles, patents and posts to your Watchlist to be notified of updates, comments and other activity. You can add items to your Watchlist by selecting the "Watch" option wherever it appears on Project Neon.';
        return;
      }

      vm.results = response.containerWItems;
      vm.totalCount = response.totalCount;
      vm.publicCount = response.publicCount;
      vm.privateCount = response.privateCount;
      vm.listType = 'All';

    }, function () {
      vm.serverMsg = 'Got server error while trying to call getContainersByUser.';
      $log.error(vm.serverMsg);
    });

    vm.toggleEditForm = function (record) {
      vm.recordToUpdate = record;
      record.inEditMode = !record.inEditMode;
      vm.isFormVisible = false;
    };

    vm.hideCreateForm = function () {
      vm.isFormVisible = false;
    };

    vm.hideEditForm = function (record) {
      record.inEditMode = false;
    };

    vm.toggleCreateForm = function () {
      vm.isFormVisible = !vm.isFormVisible;
    };

    vm.updateWatchlistType = function (value) {
      if (vm.listType === value) {
        return;
      } else {
        vm.listType = value;
      }
    };

    vm.getTotalItemTypeCount = function (containerItemTypeCount) {
      return angular.isUndefined(containerItemTypeCount) ? 0 : _calculateCounts(containerItemTypeCount);
    };

    vm.toggleContainerStatus = function (record) {

      if (record.containerStatus === 'Public') {
        record.containerStatus = 'Private';
        vm.publicCount = vm.publicCount > 0 ? vm.publicCount - 1 : 0;
        vm.privateCount += 1;
      } else {
        record.containerStatus = 'Public';
        vm.privateCount = vm.privateCount > 0 ? vm.privateCount - 1 : 0;
        vm.publicCount += 1;
      }

      record.isPublic = record.containerStatus === 'Public';

      var newStatus = record.isPublic ? 'makePublic' : 'makePrivate';

      WatchlistContainerService.updateContainerStatus(
        {
          containerId: record.containerId,
          containerName: record.containerName,
          containerStatus: newStatus
        }, function () {

          Analytics.trackEvent('watchlist-details-toggle-status', newStatus);
          $state.go($state.current, {}, {reload: true});

        }, function () {

          Notification.error('The watchlist failed to be updated. Please try again.');

        });

    };

    vm.encodeURIComponent = encodeURIComponent;

    vm.submitWatchlistForm = function (originalWatchlist, newWatchlist) {

      if (!originalWatchlist) {
        vm.results.push(newWatchlist);
        vm.totalCount = vm.results.length;

        if (newWatchlist.isPublic) {
          vm.publicCount += 1;
        } else {
          vm.privateCount += 1;
        }
        vm.hideCreateForm();
      } else {

        if (newWatchlist.containerStatus === 'Public' && originalWatchlist.containerStatus !== 'Public') {
          vm.publicCount += 1;
          vm.privateCount = vm.privateCount > 0 ? vm.privateCount - 1 : 0;
        } else if (newWatchlist.containerStatus === 'Private' && originalWatchlist.containerStatus !== 'Private') {
          vm.privateCount += 1;
          vm.publicCount = vm.publicCount > 0 ? vm.publicCount - 1 : 0;
        }
        $state.go($state.current, {}, {reload: true});

      }

    };

    function _calculateCounts(containerItemTypeCount) {
      return containerItemTypeCount.patents +
        containerItemTypeCount.wos +
        containerItemTypeCount.people +
        containerItemTypeCount.posts;
    }

  }

})(angular);