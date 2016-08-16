'use strict';

(function (angular) {
  angular
    .module('ne.views.SearchModule')
    .directive('neAggregates', aggregateDirective);

  function aggregateDirective() {
    return {
      scope: {},
      bindToController: {
        aggregates: '=',
        aggType: '=',
        onRefine: '='
      },
      restrict: 'AE',
      templateUrl: 'modules/views/search/templates/aggregate-template.html',
      controllerAs: 'vm',
      controller: aggregateController
    };
  }

  aggregateController.$inject = ['searchServiceGet', '$scope', 'FIELDS', '$log', 'Analytics', 'UidService'];

  function aggregateController(searchServiceGet, $scope, FIELDS, $log, Analytics, UidService) {
    var vm = this; // jshint ignore:line

    vm.noRefines = true;

    function parseRefineOpts() {

      var tempAggs = [];
      var keys = Object.keys(FIELDS.AGGREGATIONS[vm.aggType]);
      var refines = FIELDS.AGGREGATIONS[vm.aggType];

      var checkOnlyOnce = true;
      for (var i = 0; i < keys.length; i += 1) {

        var tempObj = { buckets: [] };
        var aggObject = vm.aggregates[refines[keys[i]].val + '_filter'];

        tempObj.display = refines[keys[i]].display;
        tempObj.name = refines[keys[i]].val;

        if (aggObject.hasOwnProperty(refines[keys[i]].val + '_selected')) {
          tempObj.buckets = aggObject[refines[keys[i]].val + '_selected'].buckets;
        }

        tempObj.buckets =  tempObj.buckets.concat(aggObject[refines[keys[i]].val].buckets);

        if (checkOnlyOnce) {
          vm.noRefines = (tempObj.buckets.length === 0);
          if (vm.noRefines === false) {
            checkOnlyOnce = false;
          }
        }
        var tempList = searchServiceGet.getRefines(tempObj.name);

        for (var rindex = 0; rindex < tempObj.buckets.length; rindex += 1) {
          var item = tempObj.buckets[rindex].key;
          if (tempList.indexOf(item) > -1) {
            tempObj.buckets[rindex].checked = true;
          } else {
            tempObj.buckets[rindex].checked = false;
          }
          tempObj.show = aggObject.open;
        }

        tempAggs.push(tempObj);
      }

      vm.aggs = tempAggs; //need to do like this here. else you will see flicker
    }

    vm.getUid = function () {
      return UidService.getUid();
    };

    vm.getAggragates = function () {

      var query = searchServiceGet.getQuery();
      var filters = searchServiceGet.getFilter();
      var defer = searchServiceGet.getAggragates(query, filters, vm.aggType);
      var previousAggs = vm.aggregates;

      defer.then(function (data) {
        angular.forEach(data.aggregations, function (value, key) {
          data.aggregations[key].open = previousAggs[key].open;
        });
        vm.aggregates = data.aggregations;
      }, function (rejection) {
        $log.error('error getting aggregations from agg dir' + rejection);
      });
    };

    vm.toggleRefines = function (item, list) {

      searchServiceGet.toggleRefines(list, item);
      searchServiceGet.createFilter(vm.aggType);

      vm.onRefine(0);
      vm.getAggragates();
    };

    vm.saveOpenFilter = function (agg) {

      var openedFilter = agg.name + '_filter';
      var aux = vm.aggregates;

      angular.forEach(aux, function (value, key) {
        if (openedFilter === key) {
          aux[key].open = aux[key].open ? !aux[key].open : true;
        } else {
          aux[key].open = aux[key].open ? aux[key].open : false;
        }
      });

      vm.aggregates = aux;
    };

    vm.resetRefines = function () {
      searchServiceGet.resetRefines();
      vm.onRefine(0);
      vm.getAggragates();
      Analytics.trackEvent('Reset Refines', '-ck-refines');
    };

    $scope.$watch(angular.bind(this, function () { // jshint ignore:line
      return this.aggregates;
    }), function (val) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        parseRefineOpts();
      }
    });


  }
})(angular);
