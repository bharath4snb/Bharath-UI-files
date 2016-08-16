'use strict';

(function (angular) {

  angular
    .module('ne.views.PublicationModule')
    .controller('RvCtrl', RvCtrl);

  RvCtrl.$inject = ['$scope', '$log', 'Analytics', '$stateParams', 'RvUtil', 'searchServiceGet', 'statisticsGet', '$location', 'CONFIG'];

  function RvCtrl($scope, $log, Analytics, $stateParams, RvUtil, searchServiceGet, statisticsGet, $location, CONFIG) {
    $scope.id = $stateParams.id;
    $scope.showRecord = false;

    var url = $location.absUrl(); //we will use this for the back button
    url = encodeURIComponent(url);
    var promise = searchServiceGet.getById($scope.id, 'ARTICLES');

    promise.then(function (data) {
      Analytics.trackEvent('wos-view', $scope.id);

      $scope.record = RvUtil.parse(data);

      if ($scope.record) {
        $scope.record.url = $location.absUrl();
      }

      if ($scope.record !== undefined && $scope.record.authors !== undefined) {
        var strLength = 0;
        $scope.authorsLimit = 0;
        for (var i = 0; i < $scope.record.authors.length; i = i + 1) {
          strLength += $scope.record.authors[i].length + 2;
          if (strLength > 250) {
            break;
          }
          $scope.authorsLimit += 1;
        }
      }

      //create the WOS CEL url
      if ($scope.record !== undefined && $scope.record.uid !== undefined) {
        $scope.WosURL = CONFIG.CEL.url + CONFIG.CEL.UT + $scope.record.cuid + CONFIG.CEL.srcUrl + url + CONFIG.CEL.srcDesc;
      } else {
        $scope.WosURL = undefined; //we will hide the button
      }
      $scope.showRecord = true;
    });

    var statistics = statisticsGet.get([$scope.id], 'wos');
    statistics.then(function (data) {
      for (var i = 0; i < data.length; i += 1) {
        $scope.commentCount = data[0].commentCount;
        $scope.viewCount = data[0].recordViewCount;
      }
    });

    $scope.$on('commentCountUpdate', function (event, data) {
      $scope.commentCount = data.commentCount;
    });

  }

})(angular);
