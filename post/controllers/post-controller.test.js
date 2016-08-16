'use strict';

describe('Unit: Post View Controller', function () {
  var ctrl;
  var $scope;
  var searchServiceError = false;
  var followServiceError = false;

  beforeEach(module('ne.views.PostModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      APPRECIATE_NEW_ENDPOINT: '/api/appreciation/appreciate',
      PROFILE_PLACEHOLDER_IMAGE: '/modules/components/user-profile-image/img/profile-placeholder.jpg'
    });

    $provide.constant('USER_PROFILE_IMAGE_CONFIG', {
      PLACEHOLDER: '/null'
    });

    $provide.value('ENGLISH', {
      authoring: {
        comment: {
          create: {
            error: {
              profanity: 'profanity',
              formatting: 'formatting',
              both: 'both'
            }
          }
        }
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

    $provide.service('UserFollowUnfollowService', function ($q) {
      this.getRelations = sinon.stub().returns($q.resolve({'15561ec2-c733-4046-97d6-63a349e399cc': 'data'}));
      if (followServiceError) {
        this.getRelations = sinon.stub().returns($q.reject({'15561ec2-c733-4046-97d6-63a349e399cc': 'data'}));
      }
    });

    $provide.service('PubSubFactory', function () {
      return {
        publish: function () {
          return angular.noop();
        }
      };
    });

    $provide.service('searchServiceGet', function ($q) {
      this.getById = sinon.stub().returns($q.resolve({data: 'data'}));
      if (searchServiceError) {
        this.getById = sinon.stub().returns($q.reject({data: 'data'}));
      }
    });

    $provide.provider('UserProfileImageService', function () {

      this.$get = function () {
        var getImageUrl = function (userId) {
          angular.noop(userId);
        };

        return {
          getImageUrl: getImageUrl
        };
      };
    });

    $provide.service('statisticsGet', function ($q) {

      var _get = function () {
        var deferred = $q.defer();
        var data = [
          {
            targetType: 'Post',
            targetId: '7bc6af8e-984d-4ae7-b742-48f4fe002729',
            commentCount: 0,
            appreciateCount: 0,
            hasAppreciated: 'NONE',
            hasReported: 'NONE',
            recordViewCount: 11,
            reportCount: 0
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      };

      return {
        get: _get
      };
    });

    $provide.service('AppreciateIt', function ($q) {

      var _put = function () {
        var deferred = $q.defer();
        var data = {
          appreciateCount: 1,
          hasAppreciated: true
        };
        deferred.resolve(data);
        return deferred.promise;
      };

      return {
        put: _put
      };
    });

    $provide.provider('amMoment', function () {

      this.$get = function () {
        var preprocessDate = function (utc, unix, local) {
          angular.noop(utc, unix, local);
        };

        return {
          preprocessDate: preprocessDate
        };
      };
    });

    $provide.service('UserProfileService', function ($q) {

      var _getMany = function (input) {
        var deferred = $q.defer();
        var data = [
          {
            truid: '15561ec2-c733-4046-97d6-63a349e399cc',
            hcrid: 0,
            firstName: 'Wayne',
            lastName: 'S'
          }, {}
        ];

        if (input[0] === 'u') {
          data = null;
        }

        deferred.resolve(data);
        return deferred.promise;
      };

      return {
        getMany: _getMany
      };
    });

    $provide.service('PostDetailsService', function ($q) {

      var _get = function () {
        var deferred = $q.defer();
        var data = {
          id: '43b84d15-7270-4d11-adf6-bf56a0e9f415',
          userId: '15561ec2-c733-4046-97d6-63a349e399cc',
          title: 'the title',
          content: 'this  is      ok',
          status: 'PUBLISHED',
          wasCleanedUp: 0,
          wasTruncated: false,
          found: true,
          keydate: 1447173905276,
          created: '2015-11-10 04:45:05',
          keydateModified: 1447770292924,
          modified: '2015-11-17 02:24:52'
        };
        deferred.resolve(data);
        return deferred.promise;
      };

      return {
        get: _get
      };
    });

  }));

  beforeEach(inject(function ($controller, _$rootScope_, Analytics, $stateParams, PostDetailsService, statisticsGet, $location, AppreciateIt, UserProfileService, UserProfileImageService, UserFollowUnfollowService, PubSubFactory, USER_PROFILE_IMAGE_CONFIG, amMoment) {
    $scope = _$rootScope_.$new();
    expect($scope).to.not.be.undefined();
    expect(amMoment).to.not.be.undefined();

    $stateParams = {
      id: '43b84d15-7270-4d11-adf6-bf56a0e9f415'
    };

    var loc = {
      pt: '',
      path: function (u) {
        if (u) {
          this.pt = u;
        }

        return this.pt;
      },
      absUrl: function () {
        return '/#/post/71946976WOS1';
      }
    };

    var  SessionFactory = {
      userId:'f66a9b5d-6fb3-4886-a894-de8ba0863232'
    };


    ctrl = $controller('PostViewController', {
      $scope: $scope,
      Analytics: Analytics,
      $stateParams: $stateParams,
      PostDetailsService: PostDetailsService,
      UserFollowUnfollowService: UserFollowUnfollowService,
      PubSubFactory: PubSubFactory,
      statisticsGet: statisticsGet,
      $location: loc,
      AppreciateIt: AppreciateIt,
      UserProfileService: UserProfileService,
      SessionFactory: SessionFactory,
      UserProfileImageService: UserProfileImageService,
      USER_PROFILE_IMAGE_CONFIG: USER_PROFILE_IMAGE_CONFIG,
      amMoment: amMoment
    });
    $scope.$apply();
  }));

  it('should contain post view controller', function () {
    expect(ctrl).not.to.equal(null);
    expect($scope.postRecord.id).not.to.equal(null);
  });

  it('tests grabStatForPost', function () {
    $scope.grabStatForPost({
      id: '43b84d15-7270-4d11-adf6-bf56a0e9f415'
    }, 'Post');
    $scope.$apply();
    expect($scope.postRecord.statistics).not.to.equal(null);
  });

  it('tests grabProfilesForPost', function () {
    searchServiceError = true;
    followServiceError = true;
    $scope.grabProfilesForPost({
      id: '43b84d15-7270-4d11-adf6-bf56a0e9f415', userId: 'user'
    }, 'Post');
    $scope.$apply();
    expect($scope.postRecord.profile).not.to.equal(null);
  });

  it('tests grabProfilesForPost with null data', function () {
    $scope.grabProfilesForPost({
      id: '43b84d15-7270-4d11-adf6-bf56a0e9f415', userId: 'u'
    }, 'Post');
    $scope.$apply();
    expect($scope.postRecord.profile).not.to.equal(null);
  });

  it('tests appreciate', function () {
    $scope.appreciateThis('uuid', 'value');
    $scope.$apply();
    expect($scope.postRecord.statistics.appreciateCount).to.equal(1);
    expect($scope.postRecord.statistics.hasAppreciated).to.equal(true);
  });

  it('test is author Give false', function () {
    var result = $scope.isAuthor('fakeid');
    expect(result).to.equal(false);
  });

  it('test is author Give true', function () {
    var result = $scope.isAuthor('f66a9b5d-6fb3-4886-a894-de8ba0863232');
    expect(result).to.equal(true);
  });

  it('test is author Give false for undefined', function () {
    var result = $scope.isAuthor(undefined);
    expect(result).to.equal(false);
  });

  it('expects toLocalTime', function () {
    $scope.toLocalTime(121212121);
    $scope.$apply();
  });

  it('expects to be true for isToday', function () {
    var milliseconds = (new Date()).getTime();
    var result = $scope.isToday(milliseconds);
    expect(result).to.equal(true);
  });

  it('expects to be false for isToday', function () {
    var result = $scope.isToday(1349258094646);
    expect(result).to.equal(false);
  });


});
