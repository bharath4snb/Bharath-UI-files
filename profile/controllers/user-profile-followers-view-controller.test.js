'use strict';

describe('Unit: User Profile Followers View Controller', function () {
  var $scope;
  var ctrl;
  var IsCurrentUsersProfile;
  var FollowersData;
  var ProfileData;

  beforeEach(module('ne.views.ProfileModule'));

  beforeEach(module(function ($provide) {
    $provide.value('IsCurrentUsersProfile', 'is current users profile');
    $provide.value('FollowersData', 'followers data');
    $provide.value('ProfileData', 'profile data');
  }));

  function createCtrl() {
    inject(function ($controller, $rootScope, _IsCurrentUsersProfile_, _FollowersData_, _ProfileData_) {
      IsCurrentUsersProfile = _IsCurrentUsersProfile_;
      FollowersData = _FollowersData_;
      ProfileData = _ProfileData_;

      $scope = $rootScope.$new();

      ctrl = $controller('UserProfileFollowersViewController', {
        $scope: $scope
      });
    });
  }

  it('exposes injected IsCurrentUsersProfile', function () {
    createCtrl();

    expect(ctrl.IsCurrentUsersProfile).to.equal(IsCurrentUsersProfile);
  });

  it('exposes injected ProfileData', function () {
    createCtrl();

    expect(ctrl.ProfileData).to.equal(ProfileData);
  });

  describe('When FollowersData is undefined', function () {

    beforeEach(module(function ($provide) {
      $provide.value('FollowersData', undefined);
    }));

    it('uses an empty object instead', function () {
      createCtrl();

      expect(ctrl.FollowersData).to.deep.equal({});
    });
  });

  describe('When FollowersData is an object', function () {

    var data = {
      thisIs: 'the data'
    };

    beforeEach(module(function ($provide) {
      $provide.value('FollowersData', {
        data: data,
        other: 'stuff'
      });
    }));

    it('exposes its data property', function () {
      createCtrl();

      expect(ctrl.FollowersData).to.equal(data);
    });
  });
});
