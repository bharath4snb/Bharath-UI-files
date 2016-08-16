'use strict';

describe('User Follow Service', function () {
  var $httpBackend;
  var CONFIG;
  var UserFollowService;
  var Analytics;

  beforeEach(module('ne.views.ProfileModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      FOLLOW_ENDPOINT: '/api/follow/user',
      SEARCH_ENDPOINT: '/api/search/v3',
      SEARCH_TYPE_ENDPOINT: {
        PEOPLE: '/people/search'
      }
    });

    $provide.provider('Analytics', function () {
      this.$get = function () {
        var trackEvent = function (category, action) {
          angular.noop(category, action);
        };

        return {
          trackEvent: trackEvent
        };
      };
    });

    $provide.service('SessionFactory', function () {
      this.userId = 'mockUserId';
    });

  }));

  beforeEach(inject(function (_$httpBackend_, _CONFIG_, _UserFollowService_, _Analytics_) {
    $httpBackend = _$httpBackend_;
    CONFIG = _CONFIG_;
    UserFollowService = _UserFollowService_;
    Analytics = _Analytics_;
  }));

  describe('Retrieve relationship between users', function () {
    beforeEach(function () {
      $httpBackend.whenGET(
        CONFIG.FOLLOW_ENDPOINT + '/tr-hao-xy/relation/tr-ivy-xx'
      ).respond({
        followRelationship: 'IS_FOLLOWER_FOLLOWED'
      });
    });

    it('should declare a getRelationship method', function () {
      expect(UserFollowService.getRelationship).to.not.be.undefined();
    });

    it('should return unknown if truid is not provided', function () {
      UserFollowService.getRelationship().then(function (relationship) {
        expect(relationship.isFollowing).to.be.false();
        expect(relationship.isFollowed).to.be.false();
        expect(relationship.isBoth).to.be.false();
        expect(relationship.isNeither).to.be.false();
        expect(relationship.isSelf).to.be.false();
      });
    });

    it('should tell if the same truids are provided', function () {
      UserFollowService.getRelationship('tr-hao-xy', 'tr-hao-xy').then(function (relationship) {
        expect(relationship.isFollowing).to.be.false();
        expect(relationship.isFollowed).to.be.false();
        expect(relationship.isBoth).to.be.false();
        expect(relationship.isNeither).to.be.false();
        expect(relationship.isSelf).to.be.true();
      });
    });

    it('should return relationship data', function () {
      UserFollowService.getRelationship('tr-hao-xy', 'tr-ivy-xx').then(
        function (relationship) {
          expect(relationship).to.not.be.undefined();
          expect(relationship.isFollowing).to.not.be.undefined();
          expect(relationship.isFollowed).to.not.be.undefined();
          expect(relationship.isBoth).to.not.be.undefined();
          expect(relationship.isNeither).to.not.be.undefined();
        }
      );
      $httpBackend.flush();
    });
  });

  describe('Follow a user', function () {
    it('should declare a follow method', function () {
      expect(UserFollowService.follow).to.not.be.undefined();
    });

    it('should return noop if truid is not provided', function () {
      expect(UserFollowService.follow()).to.equal(angular.noop);
    });
  });

  describe('Unfollow a user', function () {
    it('should declare an unfollow method', function () {
      expect(UserFollowService.unfollow).to.not.be.undefined();
    });

    it('should return noop if truid is not provided', function () {
      expect(UserFollowService.unfollow()).to.equal(angular.noop);
    });

    it('should return a promise if truids are provided', function () {
      expect(UserFollowService.unfollow('tr-hao-xy', 'tr-ivy-xx').then).to.not.be.undefined();
    });
  });

  describe('See who is following a user', function () {
    it('should declare a getFollowers method', function () {
      expect(UserFollowService.getFollowers).to.not.be.undefined();
    });

    it('should return noop if truid is not provided', function () {
      expect(UserFollowService.getFollowers()).to.equal(angular.noop);
    });
  });

  describe('See whom a user is following', function () {
    it('should declare a queryFollowing method', function () {
      expect(UserFollowService.queryFollowing).to.not.be.undefined();
    });

    it('should always return a promise', function () {
      expect(UserFollowService.queryFollowing().then).to.not.be.undefined();
    });

    it('should return an object of empty results if truid is not provided', function () {
      UserFollowService.queryFollowing().then(
        function (response) {
          expect(response).to.not.be.undefined();
          if (angular.isDefined(response.userList)) {
            expect(response.userList.length).to.equal(0);
          }
        }
      );
    });
  });
});
