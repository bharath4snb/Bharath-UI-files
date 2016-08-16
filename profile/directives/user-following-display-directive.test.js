'use strict';

describe('User Following Directive', function () {

  var scope;
  var $compile;
  var $rootScope;
  var $httpBackend;
  var UserFollowUnfollowService;
  var Notification;
  var $q;

  var element;

  var basicTemplate = '<ne-user-following-display profile-data="mockUserProfile" following-data="followingData" is-current-users-profile="true"><ne-user-following-display>';
  var zeroFollowingTemplate = '<ne-user-following-display profile-data="mockUserProfile" following-data="followingNoData" is-current-users-profile="true"><ne-user-following-display>';
  var otherUserTemplateWithFollowing = '<ne-user-following-display profile-data="mockUserProfile" following-data="followingData" is-current-users-profile="false"><ne-user-following-display>';
  var otherUserTemplateNoFollowing = '<ne-user-following-display profile-data="mockUserProfile" following-data="followingNoData" is-current-users-profile="false"><ne-user-following-display>';
  var moreThan10Following = '<ne-user-following-display profile-data="mockUserProfile" following-data="moreFollowingData" is-current-users-profile="false"><ne-user-following-display>';

  var mockUserProfile = {
    firstName: 'First',
    hcrIndicator: 'true',
    lastName: 'Last',
    location: 'Philadelphia, Pennsylvania, USA',
    middleName: 'Middle',
    primaryInstitution: 'My Company',
    role: 'My Role',
    title: 'First Middle Last',
    truid: '15561ec2-c733-4046-97d6-63a349e399aa'
  };

  var followingData = {
    next: '',
    prev: '',
    userList: '[{"truid":"f5b87429-ddfd-4bfe-9b03-fc97309d82e8","hcrid":0,"firstName":"Paul","lastName":"Barry,MSIT","interest":["AngularJS","beer","CSS3","HTML","JavaScript","soccer","web"],"hcrIndicator":false,"ut":[],"mediaCategory":"image-full","createTime":1444312101623,"updateTime":1450796922550}]'
  };

  var moreFollowingData = {
    next: 'f5b87429-ddfd-4bfe-9b03-fc97309d82e9',
    prev: '',
    userList: '[{"truid":"f5b87429-ddfd-4bfe-9b03-fc97309d82e8","hcrid":0,"firstName":"Paul","lastName":"Barry,MSIT","interest":["AngularJS","beer","CSS3","HTML","JavaScript","soccer","web"],"hcrIndicator":false,"ut":[],"mediaCategory":"image-full","createTime":1444312101623,"updateTime":1450796922550}]'
  };

  var followingNoData = [];

  beforeEach(module('ne.views.ProfileModule'));
  beforeEach(module('modules/views/profile/templates/user-following-display.html'));

  beforeEach(module(function ($provide) {

    $provide.factory('PubSubFactory', function () {
      var subscribe = function () {
        angular.noop();
      };
      return {
        subscribe: subscribe
      };
    });

    $provide.service('UserFollowUnfollowService', function ($q) {
      var getFollowing = sinon.stub().returns($q.resolve(followingData));

      return {
        getFollowing: getFollowing
      };
    });

    $provide.service('Notification', function () {
      return {
        error: function () {
          angular.noop();
        }
      };
    });

  }));


  beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_, _UserFollowUnfollowService_, _Notification_, _$q_) {
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    UserFollowUnfollowService = _UserFollowUnfollowService_;
    Notification = _Notification_;
    $q = _$q_;

    scope.mockUserProfile = mockUserProfile;
    scope.followingData = followingData;
    scope.followingNoData = followingNoData;
    scope.moreFollowingData = moreFollowingData;
    scope.busy = false;

    scope.$digest();

  }));

  function compileDirective(template, scope) {
    var elm = angular.element(template);
    $compile(elm)(scope);
    scope.$apply();
    return elm;
  }

  describe('Display current users following', function () {

    it('Expect the the following list to be visible if the user has following', function () {
      element = compileDirective(basicTemplate, scope);

      var profileObject = angular.element(element.find('.following-list'));

      expect(profileObject.hasClass('ng-hide')).to.be.false();
    });

    it('Expect the the no following message to be hidden', function () {
      element = compileDirective(basicTemplate, scope);

      var noFollowBlock = angular.element(element.find('.no-following'));

      expect(noFollowBlock.hasClass('ng-hide')).to.be.true();
    });

  });

  describe('Display Other Users following', function () {

    it('Expect the following list to be shown', function () {
      element = compileDirective(otherUserTemplateWithFollowing, scope);

      var followingList = angular.element(element.find('.following-list'));

      expect(followingList.hasClass('ng-hide')).to.be.false();
    });


    it('Expect the "No Following Yet" message to be hidden', function () {
      element = compileDirective(otherUserTemplateWithFollowing, scope);

      var noFollowBlock = angular.element(element.find('.no-following'));

      expect(noFollowBlock.hasClass('ng-hide')).to.be.true();
    });

  });

  describe('Users profile with no following', function () {

    it('Expect the "No Following Yet" message to be displayed', function () {
      element = compileDirective(zeroFollowingTemplate, scope);

      var userMessage = angular.element(element.find('.current-user-no-following'));
      var otherUserMessage = angular.element(element.find('.other-user-no-following'));

      expect(userMessage.hasClass('ng-hide')).to.be.false();
      expect(otherUserMessage.hasClass('ng-hide')).to.be.true();
    });

  });

  describe('Other user profile with no following', function () {

    it('Expect the "No Following Yet" message to be displayed', function () {
      element = compileDirective(otherUserTemplateNoFollowing, scope);

      var userMessage = angular.element(element.find('.current-user-no-following'));
      var otherUserMessage = angular.element(element.find('.other-user-no-following'));

      expect(userMessage.hasClass('ng-hide')).to.be.true();
      expect(otherUserMessage.hasClass('ng-hide')).to.be.false();
    });

  });

  describe('Get more following function', function() {

    it('Should request more following if user has more than 10', function () {
      element = compileDirective(moreThan10Following, scope);

      // var spy = sinon.spy(UserFollowUnfollowService, 'getFollowing');
      var vm = element.controller('neUserFollowingDisplay');

      vm.getMore();

      expect(UserFollowUnfollowService.getFollowing).to.have.been.called();
    });

    it('Should not request more following if a request is being processed', function () {
      element = compileDirective(moreThan10Following, scope);

      // var spy = sinon.spy(UserFollowUnfollowService, 'getFollowing');
      var vm = element.controller('neUserFollowingDisplay');

      vm.busy = true;

      vm.getMore();

      expect(UserFollowUnfollowService.getFollowing).to.have.not.been.called();
    });

    it('Should not request more following if user has less than 10 following', function () {
      element = compileDirective(basicTemplate, scope);

      // var spy = sinon.spy(UserFollowUnfollowService, 'getFollowing');
      var vm = element.controller('neUserFollowingDisplay');

      vm.getMore();

      expect(UserFollowUnfollowService.getFollowing).to.have.not.been.called();
    });

  });

  describe('Error getting following', function() {

    beforeEach(inject(function () {
      UserFollowUnfollowService.getFollowing.returns($q.reject({status: 500}));
    }));

    it('Should show a toast notification if an error occurs in the service', function () {
      element = compileDirective(moreThan10Following, scope);

      var spy = sinon.spy(Notification, 'error');
      var vm = element.controller('neUserFollowingDisplay');

      vm.getMore();

      $rootScope.$apply();

      expect(spy).to.have.been.calledWith('Could not get more following. Please try again later');
    });


  });

  describe('Subscribes to $FollowStatusUpdated events', function () {

    it('if own profile, calls subscribe with a function that reloads $state', inject(function (PubSubFactory, $state) {
      var subscription = sinon.spy(PubSubFactory, 'subscribe').withArgs(
        '$FollowStatusUpdated',
        sinon.match.func);
      element = compileDirective(basicTemplate, scope);

      expect(subscription).to.have.been.calledOnce();

      sinon.stub($state, 'reload');
      subscription.firstCall.args[1](); // invoke the handler

      expect($state.reload).to.have.been.calledWith('profile.following');
    }));

    it('if not own profile, does not call subscribe', inject(function (PubSubFactory) {
      var subscription = sinon.spy(PubSubFactory, 'subscribe').withArgs(
        '$FollowStatusUpdated',
        sinon.match.func);
      element = compileDirective(otherUserTemplateWithFollowing, scope);

      expect(subscription).not.to.have.been.called();
    }));
  });

});
