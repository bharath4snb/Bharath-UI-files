'use strict';

describe('Unit: User Profile Posts View Controller', function () {
  var $scope;
  var ctrl;
  var mockTruid = 'mock-truid';
  var counterValue = 5;
  var ProfileData;
  var IsCurrentUsersProfile;
  var PostData;
  var PostsCount;

  beforeEach(module('ne.views.ProfileModule'));

  beforeEach(module(function ($provide) {
    $provide.value('ProfileData', {
      truid: mockTruid
    });

    $provide.value('IsCurrentUsersProfile', 'is current users profile');
    $provide.value('PostData', 'post data');
    $provide.value('PostsCount', {
      counterValue: counterValue
    });

  }));

  beforeEach(inject(function ($controller, $rootScope, _ProfileData_, _IsCurrentUsersProfile_, _PostData_, _PostsCount_) {
    ProfileData = _ProfileData_;
    IsCurrentUsersProfile = _IsCurrentUsersProfile_;
    PostData = _PostData_;
    PostsCount = _PostsCount_;

    $scope = $rootScope.$new();

    ctrl = $controller('UserProfilePostsViewController', {
      $scope: $scope
    });
  }));

  it('exposes injected services', function () {
    expect(ctrl.ProfileData).to.equal(ProfileData);
    expect(ctrl.IsCurrentUsersProfile).to.equal(IsCurrentUsersProfile);
    expect(ctrl.PostData).to.equal(PostData);
    expect(ctrl.truid).to.equal(mockTruid);
    expect(ctrl.PostsCount).to.equal(counterValue);
  });
});
