'use strict';

(function (angular) {

  angular
    .module('ne.views.ProfileModule')
    .service('UserFollowService', UserFollowService);

  UserFollowService.$inject = ['$q', '$resource', 'CONFIG', 'Analytics', 'UserProfileSearchService', 'UserProfileService'];

  function UserFollowService($q, $resource, CONFIG, Analytics, UserProfileSearchService, UserProfileService) {
    var unknownRelationship = {
      isFollowing: false,
      isFollowed: false,
      isBoth: false,
      isNeither: false,
      isUnknown: true,
      isSelf: false
    };

    var relations = [];

    function getRelationshipFlags(response) {
      var relationshipFlags = angular.copy(unknownRelationship);
      if (angular.isDefined(response) &&
          angular.isDefined(response.followRelationship) &&
          response.followRelationship.length > 0) {
        var relationship = response.followRelationship;
        if (relationship === 'IS_FOLLOWER') {
          relationshipFlags.isFollowing = true;
          relationshipFlags.isUnknown = false;
        }
        if (relationship === 'IS_FOLLOWED') {
          relationshipFlags.isFollowed = true;
          relationshipFlags.isUnknown = false;
        }
        if (relationship === 'IS_FOLLOWER_FOLLOWED') {
          relationshipFlags.isFollowing = true;
          relationshipFlags.isFollowed = true;
          relationshipFlags.isBoth = true;
          relationshipFlags.isUnknown = false;
        }
        if (relationship === 'IS_NONE') {
          relationshipFlags.isNeither = true;
          relationshipFlags.isUnknown = false;
        }
      }
      return relationshipFlags;
    }

    function getRelationshipFlagsFromHttp(response) {
      if (angular.isDefined(response)) {
        return getRelationshipFlags(angular.fromJson(response));
      }
      return unknownRelationship;
    }

    function convertUserListJson(response) {
      if (angular.isUndefined(response) || response.length < 1) {
        return {};
      }
      try {
        var data = angular.fromJson(response);
        try {
          var userList = angular.fromJson(data.userList);
          data.userList = UserProfileService.setDefaultTitles(userList);
        } catch (e) {
          data.userList = [];
        }
        return data;
      } catch (e) {
        return {};
      }
    }

    var _followersCountApi = $resource(CONFIG.FOLLOW_ENDPOINT + '/:truid/count/followers');
    var _followingCountApi = $resource(CONFIG.FOLLOW_ENDPOINT + '/:truid/count/following');

    var _followersProfilesApi = $resource(CONFIG.FOLLOW_ENDPOINT + '/:truid/followers/profiles', {}, {
      queryFollowers: {
        method: 'GET',
        params: {
          truid: '@truid'
        },
        transformResponse: convertUserListJson
      }
    });

    var _followingProfilesApi = $resource(CONFIG.FOLLOW_ENDPOINT + '/:truid/following/profiles', {}, {
      queryFollowing: {
        method: 'GET',
        params: {
          truid: '@truid'
        },
        transformResponse: convertUserListJson
      }
    });

    var _api = $resource(CONFIG.FOLLOW_ENDPOINT, {},
      {
        follow: {
          method: 'POST',
          url: CONFIG.FOLLOW_ENDPOINT + '/:truid/following/:otherTruid',
          params: {
            truid: '@truid',
            otherTruid: '@otherTruid'
          },
          transformResponse: getRelationshipFlagsFromHttp
        },
        getFollowers: {
          method: 'GET',
          url: CONFIG.FOLLOW_ENDPOINT + '/:truid/followers/profiles',
          params: {
            truid: '@truid'
          },
          transformResponse: UserProfileSearchService.skimResultsFromHttp
        },
        getRelationship: {
          method: 'GET',
          url: CONFIG.FOLLOW_ENDPOINT + '/:truid/relation/:otherTruid',
          params: {
            truid: '@truid',
            otherTruid: '@otherTruid'
          },
          transformResponse: getRelationshipFlagsFromHttp
        },
        getRelations: {
          method: 'GET',
          url: CONFIG.FOLLOW_ENDPOINT + '/:truid/relations',
          params: {
            truid: '@truid'
          }
        },
        unfollow: {
          method: 'DELETE',
          url: CONFIG.FOLLOW_ENDPOINT + '/:truid/following/:otherTruid',
          params: {
            truid: '@truid',
            otherTruid: '@otherTruid'
          },
          transformResponse: getRelationshipFlagsFromHttp
        }
      });

    var _follow = function (truid, otherTruid) {
      if (angular.isDefined(truid) && angular.isDefined(otherTruid)) {
        relations[otherTruid] = 'IS_FOLLOWER';
        Analytics.trackEvent('follow-srv', otherTruid);
        return _api.follow({
          truid: truid,
          otherTruid: otherTruid
        }).$promise;
      }
      return angular.noop;
    };

    var _getFollowers = function (params) {
      if (angular.isDefined(params) && angular.isDefined(params.truid)) {
        return _api.getFollowers(params).$promise;
      }
      return angular.noop;
    };

    var _queryFollowers = function (params) {
      if (angular.isDefined(params) && angular.isDefined(params.truid)) {
        return _followersProfilesApi.queryFollowers(params).$promise;
      }
      var deferred = $q.defer();
      deferred.resolve({
        userList: []
      });
      return deferred.promise;
    };

    var _queryFollowing = function (params) {
      if (angular.isDefined(params) && angular.isDefined(params.truid)) {
        return _followingProfilesApi.queryFollowing(params).$promise;
      }
      var deferred = $q.defer();
      deferred.resolve({
        userList: []
      });
      return deferred.promise;
    };

    var _getFollowersCount = function (truid) {
      if (angular.isDefined(truid) && truid.length > 0) {
        return _followersCountApi.get({ truid: truid }).$promise;
      }
      var deferred = $q.defer();
      deferred.resolve({
        count: 0
      });
      return deferred.promise;
    };

    var _getFollowingCount = function (truid) {
      if (angular.isDefined(truid) && truid.length > 0) {
        return _followingCountApi.get({ truid: truid }).$promise;
      }
      var deferred = $q.defer();
      deferred.resolve({
        count: 0
      });
      return deferred.promise;
    };

    var _getRelationship = function (truid, otherTruid) {
      var deferred;
      if (angular.isDefined(truid) && angular.isDefined(otherTruid)) {
        if (truid === otherTruid) {
          deferred = $q.defer();
          var relationship = _setRelationshipFlag(
            angular.copy(unknownRelationship), {
              isSelf: true
            }
          );
          deferred.resolve(relationship);
          return deferred.promise;
        }
        return _api.getRelationship({
          truid: truid,
          otherTruid: otherTruid
        }).$promise;
      }
      deferred = $q.defer();
      deferred.resolve(unknownRelationship);
      return deferred.promise;
    };

    var _getRelations = function (truid, ids) {
      if (angular.isDefined(truid) && angular.isDefined(ids)) {
        return _api.getRelations({
          truid: truid,
          id: ids
        }).$promise;
      }
      return angular.noop;
    };

    var _setRelationshipFlag = function (relationship, params) {
      if (angular.isUndefined(params)) {
        return relationship;
      }
      if (angular.isDefined(params.isSelf)) {
        relationship.isSelf = params.isSelf;
      }
      if (angular.isDefined(params.isFollowing)) {
        relationship.isFollowing = params.isFollowing;
      }
      if (angular.isDefined(params.isFollowed)) {
        relationship.isFollowed = params.isFollowed;
      }
      if (angular.isDefined(params.isBoth)) {
        if (params.isBoth) {
          relationship.isFollowing = true;
          relationship.isFollowed = true;
        }
        relationship.isBoth = params.isBoth;
      } else {
        relationship.isBoth = relationship.isFollowing && relationship.isFollowed;
      }
      if (angular.isDefined(params.isNeither)) {
        if (params.isNeither) {
          relationship.isFollowing = false;
          relationship.isFollowed = false;
        }
        relationship.isNeither = params.isNeither;
      } else {
        relationship.isNeither = !relationship.isFollowing && !relationship.isFollowed;
      }
      return relationship;
    };

    var _unfollow = function (truid, otherTruid) {
      if (angular.isDefined(truid) && angular.isDefined(otherTruid)) {
        Analytics.trackEvent('unfollow-srv', otherTruid);
        relations[otherTruid] = 'IS_NONE';
        return _api.unfollow({
          truid: truid,
          otherTruid: otherTruid
        }).$promise;
      }
      return angular.noop;
    };


    return {
      follow: _follow,
      getFollowers: _getFollowers,
      getFollowersCount: _getFollowersCount,
      getFollowingCount: _getFollowingCount,
      getRelationship: _getRelationship,
      getRelations: _getRelations,
      queryFollowers: _queryFollowers,
      queryFollowing: _queryFollowing,
      setRelationshipFlag: _setRelationshipFlag,
      unfollow: _unfollow
    };
  }
})
(angular);
