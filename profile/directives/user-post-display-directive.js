'use strict';

(function (angular) {
  angular
    .module('ne.views.ProfileModule')
    .directive('neUserPostDisplay', UserPostDisplay);

  function UserPostDisplay() {
    return {
      bindToController: {
        profileData: '=',
        isCurrentUsersProfile: '=',
        postsData: '=',
        truid: '=',
        postsCount: '='
      },
      controller: UserPostDisplayController,
      restrict: 'E',
      scope: {},
      require: 'UserPostDisplayController',
      controllerAs: 'vm',
      templateUrl: 'modules/views/profile/templates/user-post-display.html'
    };
  }

  UserPostDisplayController.$inject = ['Analytics', '$q', '$log', 'PostDataService', 'CommentDataService', 'statisticsGet'];

  function UserPostDisplayController(Analytics, $q, $log, PostDataService, CommentDataService, statisticsGet) {

    var vm = this;

    var incrementDefault = 10;

    vm.hasPosts = false;
    vm.postCount = parseInt(vm.postsCount, 10) || 0;
    vm.title = '';
    vm.busy = false;
    vm.posts = vm.postsData.posts;
    vm.grabMore = postDataServiceCall;
    vm.postsAvalaible = vm.postCount > 10;
    vm.latestPostId = '';

    activate();

    function activate() {
      if (vm.truid) {
        parsePostsData();
      } else {
        $log.error('This directive requieres a truid property');
      }
    }

    function getCommentsCount() {

      var allPromises = [];

      angular.forEach(vm.posts, function (post) {

        var deferred = $q.defer();

        CommentDataService.getCommentsCount({
          targetId: post.id,
          targetType: 'posts'
        }, function (data) {
          deferred.resolve(angular.extend(post, {commentCount: data.counterValue}));
        }, function (err) {
          deferred.reject(err);
        });

        allPromises.push(deferred.promise);
      });

      $q.all(allPromises)
        .then(function (allData) {

          vm.posts = allData;
        })
        .catch(function (err) {
          $log.error(err);
        });

    }

    function getPostLikeCount() {
      angular.forEach(vm.posts, function (post) {
        statisticsGet.get([post.id], 'posts').then(function (data) {
          _.extend(post, {LikeCount: data[0].appreciateCount});
        }).catch(function (err) {

          $log.error(err);

        });
      });
    }


    function parsePostsData() {
      var postsList = vm.posts;
      vm.hasPosts = (vm.postCount > 0);
      updateLatestPostId(postsList);
      compareUsersProfile();
      getCommentsCount();
      getPostLikeCount();
    }

    function updateLatestPostId(postsArray) {
      var len = postsArray.length;
      if (len === 0) {
        return;
      }
      var lastPost = postsArray[len - 1];
      if (angular.isUndefined(lastPost)) {
        return;
      }
      vm.latestPostId = lastPost.id;
    }

    function postDataServiceCall() {
      if (!vm.busy && vm.postsAvalaible) {

        vm.busy = true;

        PostDataService.getPostsByUser({
          targetId: vm.truid,
          size: incrementDefault,
          latestPostId: vm.latestPostId,
          includeContent: true

        }, function (data) {

          updateLatestPostId(data.posts);
          addMorePostsToView(data.posts);

          getCommentsCount();
          getPostLikeCount();
          Analytics.trackEvent('profile-post', 'scroll');

        }, function (err) {
          $log.error(err);
        });
      }
    }

    function compareUsersProfile() {

      if (!vm.IsCurrentUsersProfile) {
        vm.title = vm.profileData.title;
      }
    }

    function addMorePostsToView(newPosts) {
      var actualPosts = vm.posts;
      var newList = actualPosts.concat(newPosts);

      vm.posts = newList;

      vm.postsAvalaible = vm.posts.length < vm.postCount;

      vm.busy = false;

    }
  }

})(angular);
