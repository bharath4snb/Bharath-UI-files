'use strict';

(function (angular) {

  angular
    .module('ne.views.PublicationModule')
    .controller('patentCtrl', patentCtrl);

  patentCtrl.$inject = ['$scope', 'Analytics', '$stateParams', 'RvUtil', 'searchServiceGet', 'statisticsGet', '$location', '$log', 'CONFIG'];

  function patentCtrl($scope, Analytics, $stateParams, RvUtil, searchServiceGet, statisticsGet, $location, $log, CONFIG) {
    var vm = this; //jshint ignore:line
    vm.id = $stateParams.id;
    vm.showRecord = false;

    var url = $location.absUrl();
    url = encodeURIComponent(url);
    var promise = searchServiceGet.getById(vm.id, 'PATENTS');

    promise.then(function (data) {
      Analytics.trackEvent('patents-view', vm.id);

      vm.record = RvUtil.parsePatent(data);

      if (vm.record) {
        vm.record.url = $location.absUrl();
      }

      if (vm.record !== undefined && vm.record.uid !== undefined) {
        vm.patentsURL = CONFIG.EXTERNAL_PATENTS.url + vm.record.uid + CONFIG.EXTERNAL_PATENTS.databaseIds;
      } else {
        vm.patentsURL = undefined;
      }

    }, function(err) {
      $log.error(err);
    });

    var statistics = statisticsGet.get([vm.id], 'patents');
    statistics.then(function (data) {
      for (var i = 0; i < data.length; i += 1) {
        vm.commentCount = data[0].commentCount;
        vm.viewCount = data[0].recordViewCount;
      }
    });

    $scope.$on('commentCountUpdate', function (event, data) {
      vm.commentCount = data.commentCount;
    });

  }

})(angular);
