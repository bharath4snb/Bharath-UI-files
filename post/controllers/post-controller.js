'use strict';

(function (angular) {

  angular
    .module('ne.views.PostModule')
    .controller('PostViewController', PostViewController);

  PostViewController.$inject = ['$scope', '$log', 'Analytics', '$stateParams', 'PostDetailsService', 'statisticsGet', '$location', 'AppreciateIt', 'UserFollowUnfollowService', 'UserProfileService', 'SessionFactory', 'UserProfileImageService', 'USER_PROFILE_IMAGE_CONFIG', 'PubSubFactory', 'amMoment', 'searchServiceGet'];

  function PostViewController($scope, $log, Analytics, $stateParams, PostDetailsService, statisticsGet, $location, AppreciateIt, UserFollowUnfollowService, UserProfileService, SessionFactory, UserProfileImageService, USER_PROFILE_IMAGE_CONFIG, PubSubFactory, amMoment, searchServiceGet) {
    $scope.id = $stateParams.id;
    $scope.showPostRecord = false;
    $scope.record = {};
    $scope.postProfileEvent = 'POST_PROFILE_EVENT';

    var url = $location.absUrl();
    var promise = PostDetailsService.get({postId: $scope.id});
    var searchServicePromise = searchServiceGet.getById($scope.id, 'POSTS');

    url = encodeURIComponent(url);

    searchServicePromise.then(function (data) {
      $scope.record = data;
    }, function(err) {
      $log.error(err);
    });


    promise.then(function (data) {
      Analytics.trackEvent('posts-view', $stateParams.id);

      $scope.postRecord = data;

      if ($scope.postRecord) {
        $scope.postRecord.url = $location.absUrl();
      }

      $scope.grabStatForPost(data);
      $scope.grabProfilesForPost(data);
      $scope.showPostRecord = true;
    });

    $scope.grabStatForPost = function (postData) {
      var statistics = statisticsGet.get([postData.id], 'posts');
      statistics.then(function (data) {
        for (var i = 0; i < data.length; i += 1) {
          $scope.postRecord.statistics = data[0];
          $scope.commentCount = data[0].commentCount;
          $scope.viewCount = data[0].recordViewCount;
        }
      });
    };

    $scope.isAuthor = function (uuid) {
      if (angular.isUndefined(uuid)) {
        return false;
      } else {
        return angular.isDefined(SessionFactory.userId) && (uuid === SessionFactory.userId);
      }
    };

    $scope.grabProfilesForPost = function (postData) {
      if (angular.isUndefined(postData.userId)) {
        return;
      }

      var uniqueIds = [postData.userId];

      UserProfileService.getMany(uniqueIds).then(function (data) {
        var returnData = [];
        if (angular.isArray(data)) {
          returnData = data;
        } else {
          returnData.push(data);
        }
        angular.forEach(returnData, function (value) {
          if (value === null) {
            return;
          }
          var currentUid = value.truid;
          if (currentUid === $scope.postRecord.userId) {
            $scope.postRecord.profile = value;

            UserFollowUnfollowService.getRelations(SessionFactory.userId, [currentUid]).then(function (relationships) {
              if (angular.isDefined(relationships[currentUid])) {
                $scope.postRecord.profile.relationship = relationships[currentUid];
              }
            }).catch(function (error) {
              $log.error(error);
            }).finally(function () {
              PubSubFactory.publish($scope.postProfileEvent, $scope.postRecord.profile);
            });
          }

        });

      });
    };

    $scope.makeProfileImageUrl = function (data) {
      return UserProfileService.getImageSource(data);
    };

    $scope.getImageUrl = UserProfileImageService.getImageUrl;
    $scope.imagePlaceholder = USER_PROFILE_IMAGE_CONFIG.PLACEHOLDER;

    $scope.appreciateThis = function (uuid, value) {
      AppreciateIt.put(value, 'posts', uuid).then(function (data) {
        $scope.postRecord.statistics.appreciateCount = data.appreciateCount;
        $scope.postRecord.statistics.hasAppreciated = data.hasAppreciated;
      });

    };

    $scope.toLocalTime = function (unix) {
      return amMoment.preprocessDate(unix, 'unix', 'local');
    };

    $scope.isToday = function (unix) {
      var inputDate = new Date(unix);
      var todaysDate = new Date();

      return (inputDate.toLocaleDateString() === todaysDate.toLocaleDateString());
    };

    $scope.isStatusAsAnyDeleted = function() {
      if ($scope.postRecord === null || angular.isUndefined($scope.postRecord)) {
        return false;
      }
      return $scope.postRecord.status === 'ADMIN_DELETED' || $scope.postRecord.status === 'DELETED';
    };

    $scope.isStatusAsAdminDeleted = function() {
      if ($scope.postRecord === null || angular.isUndefined($scope.postRecord)) {
        return false;
      }
      return $scope.postRecord.status === 'ADMIN_DELETED';
    };

    $scope.isStatusAsDeleted = function() {
      if ($scope.postRecord === null || angular.isUndefined($scope.postRecord)) {
        return false;
      }
      return $scope.postRecord.status === 'DELETED';
    };

    $scope.$on('commentCountUpdate', function (event, data) {
      $scope.commentCount = data.commentCount;
    });
  }

})(angular);
