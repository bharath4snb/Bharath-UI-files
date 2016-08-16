'use strict';

(function (angular) {
  angular
    .module('ne.views.ProfileModule')
    .directive('neUserCommentsDisplay', UserCommentsDisplay);

  function UserCommentsDisplay() {
    return {
      bindToController: {
        profileData: '=',
        isCurrentUsersProfile: '=',
        commentsData: '=',
        truid: '=',
        commentsCount: '='
      },
      controller: UserCommentsDisplayController,
      restrict: 'E',
      scope: {},
      require: 'UserCommentsDisplayController',
      controllerAs: 'vm',
      templateUrl: 'modules/views/profile/templates/user-comments-display.html'
    };
  }

  UserCommentsDisplayController.$inject = ['Analytics', 'userCommentListsGet', 'statisticsGet', 'AppreciateIt', 'searchServiceGet', '$log'];

  function UserCommentsDisplayController(Analytics, userCommentListsGet, statisticsGet, AppreciateIt, searchServiceGet, $log) {

    var vm = this; // jshint ignore:line

    vm.commentList = {
      size: 10,
      latestCommentId: null,
      comments: vm.commentsData.comments || null,
      count: parseInt(vm.commentsCount, 10) || 0
    };

    vm.hasComments = false;
    vm.busy = false;

    vm.commentsAvalaible = vm.commentList.count > 10;

    var trimDate = function (str) {
      var delimiter = ' ';
      var segment = str.split(delimiter).slice(0);
      return segment[1] + segment[2] + segment[3];
    };

    activate();

    function activate() {
      if (vm.truid) {
        parseCommentsData();
      } else {
        $log.error('This directive requieres a truid property');
      }
    }

    function parseCommentsData() {
      var commentsList = vm.commentsData.comments;
      vm.hasComments = (vm.commentList.count > 0);

      compareUsersProfile();
      updateLatestCommentId(commentsList);
      grabTargetsForComments(commentsList);
      grabStatisticsForComments(commentsList);

    }

    function updateLatestCommentId(commentArray) {
      var len = commentArray.length;
      if (len === 0) {
        return;
      }
      var thisComment = commentArray[len - 1];
      if (angular.isUndefined(thisComment)) {
        return;
      }
      vm.commentList.latestCommentId = thisComment.id;
    }

    function grabStatisticsForComments(commentArray) {
      var len = commentArray.length;
      if (len === 0) {
        return;
      }

      var uniqueIds = [];
      angular.forEach(commentArray, function (value) {
        uniqueIds.push(value.id);
      });

      if (uniqueIds.length === 0) {
        return;
      }

      statisticsGet.get(uniqueIds, 'Comment').then(function (data) {
        angular.forEach(data, function (value) {
          if (value === null) {
            return;
          }
          var currentUid = value.targetId;

          angular.forEach(vm.commentList.comments, function (valueInner) {

            var targetUid = valueInner.id;
            if (currentUid === targetUid) {
              valueInner.statistics = value;
            }
          });
        });

      });
    }

    function grabTargetsForComments(commentArray) {
      var len = commentArray.length;
      if (len === 0) {
        return;
      }
      var search = searchServiceGet;

      angular.forEach(vm.commentList.comments, function (comment) {
        var targetUid = comment.targetId;
        var detailType = comment.targetType.toUpperCase();

        if (detailType === 'WOS' || detailType === 'TRRECORD') {
          detailType = 'ARTICLES';
        }

        if ((!angular.isUndefined(detailType) && detailType !== null) && (!angular.isUndefined(targetUid) && targetUid !== null)) {
          search.getById(targetUid,  detailType).then(function (data) {
            comment.record = data;
          }).catch(function (err) {
            $log.error(err);
          });
        }

      });

    }

    function compareUsersProfile() {

      if (!vm.IsCurrentUsersProfile) {
        vm.title = vm.profileData.title;
      }
    }

    vm.grabMore = function () {

      if (!vm.busy && vm.commentsAvalaible) {

        vm.busy = true;

        userCommentListsGet.get(vm.truid, vm.commentList.size, vm.commentList.latestCommentId)
        .then(function (data) {

          vm.busy = false;

          if (angular.isUndefined(data)) {
            return;
          }
          vm.commentList.count = data.size;
          if (angular.isUndefined(data.comments)) {
            return;
          }

          updateLatestCommentId(data.comments);

          if (data.comments.length === 0) {
            return;
          }

          if (angular.isUndefined(vm.commentList.comments)) {
            vm.commentList.comments = data.comments;
          } else {
            vm.commentList.comments = vm.commentList.comments.concat(data.comments);
          }

          vm.commentsAvalaible = vm.commentList.comments.length < vm.commentList.count;
          grabTargetsForComments(data.comments);
          grabStatisticsForComments(data.comments);
          Analytics.trackEvent('profile-comment', 'scroll');

        });
      }
    };

    vm.toLocalTime = function (date) {
      var newDate = new Date(date);
      var dateUtc = newDate.toUTCString();
      var localDate = new Date(dateUtc);
      return localDate;
    };

    vm.isDateTodaysDate = function(input) {
      var pattern = /-/ig;
      var today = new Date();
      var testDate = input.replace(pattern, '/');
      testDate = new Date(testDate);

      return trimDate(testDate.toString()) === trimDate(today.toString());
    };

    vm.appreciateThis = function(uuid, value) {
      AppreciateIt.put(value, 'Comment', uuid).then(function (data) {

        if (data) {
          var currentUid = data.targetId;

          Analytics.trackEvent('appreciate-comment', data.targetId);

          angular.forEach(vm.commentList.comments, function (valueInner) {
            var targetUid = valueInner.id;
            if (currentUid === targetUid) {
              valueInner.statistics = data;
            }
          });
        }
      });
    };
  }

})(angular);
