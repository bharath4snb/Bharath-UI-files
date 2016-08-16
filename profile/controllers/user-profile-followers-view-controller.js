'use strict';

(function (angular) {

  angular
    .module('ne.views.ProfileModule')
    .controller('UserProfileFollowersViewController', UserProfileFollowersViewController);

  UserProfileFollowersViewController.$inject = ['FollowersData', 'IsCurrentUsersProfile', 'ProfileData'];

  function UserProfileFollowersViewController(FollowersData, IsCurrentUsersProfile, ProfileData) {
    var vm = this;

    if (FollowersData) {
      vm.FollowersData = FollowersData.data;
    } else {
      vm.FollowersData = {};
    }

    vm.IsCurrentUsersProfile = IsCurrentUsersProfile;

    vm.ProfileData = ProfileData;
  }

})(angular);
