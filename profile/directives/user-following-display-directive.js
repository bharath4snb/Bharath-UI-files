'use strict';

(function (angular) {
  angular
    .module('ne.views.ProfileModule')
    .directive('neUserFollowingDisplay', UserFollowingDisplay);

  function UserFollowingDisplay() {
    return {
      bindToController: {
        profileData: '=',
        followingData: '=',
        isCurrentUsersProfile: '='
      },
      controller: UserFollowingDisplayController,
      restrict: 'E',
      scope: {},
      require: 'UserFollowingDisplayController',
      controllerAs: 'vm',
      templateUrl: 'modules/views/profile/templates/user-following-display.html'
    };
  }

  UserFollowingDisplayController.$inject = ['$scope', 'UserFollowUnfollowService', 'Notification', 'PubSubFactory', '$state'];

  function UserFollowingDisplayController($scope, UserFollowUnfollowService, Notification, PubSubFactory, $state) {

    var vm = this;

    vm.hasFollowing = false;
    vm.getMore = getMore;
    vm.busy = false;

    activate();

    function activate() {

      parseFollowingData();
      compareUsersProfile();

    }

    function parseFollowingData() {

      if (vm.followingData && vm.followingData.userList) {
        vm.hasFollowing = true;
        vm.followingList = JSON.parse(vm.followingData.userList);
        vm.nextFollowing = vm.followingData.next;

      } else {
        vm.hasFollowing = false;
      }
    }

    function compareUsersProfile() {

      if (!vm.isCurrentUsersProfile) {
        vm.title = vm.profileData.title;
      }
    }

    function getMore() {

      if (vm.nextFollowing.length > 0 && !vm.busy) {
        vm.busy = true;

        UserFollowUnfollowService.getFollowing(vm.profileData.truid, 10, vm.nextFollowing)
          .then(function(response) {
            vm.nextFollowing = response.data.next;

            addMoreFollowingToView(JSON.parse(response.data.userList));
          })
          .catch(function() {
            Notification.error('Could not get more following. Please try again later');
          });
      }
    }

    function addMoreFollowingToView(newFollowing) {
      var actualFollowing = vm.followingList;
      var newList = actualFollowing.concat(newFollowing);

      vm.followingList = newList;

      vm.busy = false;

    }

    if (vm.isCurrentUsersProfile) {
      var unsubscribe = PubSubFactory.subscribe('$FollowStatusUpdated', function () {
        $state.reload('profile.following');
      });

      // We only want to reload the following state if we're viewing our own profile.
      // If we don't unsubscribe here, then:
      //   1. View own profile, following tab
      //   2. View someone else's profile, following tab
      //   3. Un/follow someone on that tab
      //   4. State is refreshed unnecessarily (visable as page scrolling to top)
      $scope.$on('$destroy', unsubscribe);
    }
  }
})(angular);
