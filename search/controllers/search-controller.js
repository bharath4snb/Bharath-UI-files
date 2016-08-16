'use strict';

(function (angular) {

  angular
    .module('ne.views.SearchModule')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$log', 'CONFIG', '$stateParams', 'searchServiceGet', '$state', 'ENGLISH', 'screenSize', 'Analytics', 'Notification', 'SearchResultsService', 'FIELDS', 'SearchService'];

  function SearchController($scope, $log, CONFIG, $stateParams, searchServiceGet, $state, ENGLISH, screenSize, Analytics, Notification, SearchResultsService, FIELDS, SearchService) {

    var offset = $stateParams.offsetIndex ? parseInt($stateParams.offsetIndex) : 0;
    var refineCollapsed = false;
    var _this = this;

    $scope.searchResults = [];
    $scope.profilesFound = [];
    $scope.searchType = !$stateParams.searchType ? 'ALL' : $stateParams.searchType;
    searchServiceGet.setRefines($scope.searchType);
    $scope.noResults = false;
    $scope.busy = false;
    $scope.render = true;
    $scope.totalResults = 0;
    $scope.aggs = [];
    $scope.filters = '';
    $scope.refineDisabled = false;
    $scope.orderBy = angular.isDefined($stateParams.sortType) ? $stateParams.sortType : '';
    $scope.sortText = 'Relevance';
    $scope.queryCounters = {};

    if (angular.isDefined($stateParams.filter)) {
      searchServiceGet.resetRefines();
      searchServiceGet.setRefines($stateParams.filter.aggType);
      searchServiceGet.toggleRefines($stateParams.filter.refine, $stateParams.filter.value);
      searchServiceGet.createFilter($stateParams.filter.aggType);
      $scope.refineDisabled = false;
    }



    $scope.getSearchResults = getSearchResults;
    this.newSearch = newSearch;

    $scope.resetQuery = $stateParams.query;

    $scope.setSortValue = setSortValue;

    if (angular.isDefined($stateParams.query)) {
      try {
        $scope.lastQuery = decodeURIComponent($stateParams.query);
      } catch (e) {
        $scope.lastQuery = $stateParams.query;
      }
    }


    function trackSearchResults(category, query, orderBy, filters, totalResults) {
      var sortPrint = (orderBy) ? 'sort: ' + orderBy : '';
      // &filter= 8, magic string logic follows
      var filterPrint = (filters) ? 'filters: ' + filters.substring(8) + ' ' : '';
      var categoryPrint = (category) ? 'category: ' + category + ' ' : '';
      Analytics.trackEventFull('search-srv', query, categoryPrint + filterPrint + sortPrint, totalResults);
    }

    function getSearchResults(off) {

      offset = angular.isDefined(off) ? off : 0;
      $scope.busy = true;
      if (angular.isDefined(getQuery()) && getQuery() !== '') {
        searchServiceGet.setQuery(getQuery());
        var promise = searchServiceGet.get(getQuery(), CONFIG.SEARCH_MAX_PER_PAGE, offset, $scope.orderBy, undefined, $scope.searchType);
        promise.then(function(data) {
          $scope.busy = false;
          handleTypeResults(data);
        }, function(reject) {
          $state.go('error', { code: CONFIG.ERROR_CODE.SEARCH_FAIL, message: reject });
        });
      }

      getTypeCounters();
    }

    $scope.getSearchResults = getSearchResults;

    function handleTypeResults(data) {

      var count = data[0] && data[0].total ? data[0].total : '0';
      count = count.replace(/,/g, '');

      offset = offset === 0 ? 10 : offset;

      $scope.searchResults = SearchResultsService.amend(data);
      SearchResultsService.getProfiles(data).then(function (response) {
        $scope.searchResults = response;
      }).catch(function (error) {
        $log.error(error);
      });

      $scope.totalResults = parseFloat(count);

      $scope.noResults = $scope.totalResults === 0;

      $scope.filters = searchServiceGet.getFilter();

      trackSearchResults($scope.searchType, getQuery(), $scope.orderBy, $scope.filters, $scope.totalResults);
    }

    function newSearch() {

      offset = 0;
      toggleRefinePanel();
      getSearchResults();

    }

    function getTypeCounters() {
      $scope.lastQuery = SearchService.cleanQuery($scope.lastQuery);
      /* jshint ignore:start */
      // jscs:disable

      var promise  = searchServiceGet.getTypeCounters($scope.lastQuery);

      promise.then(function(data) {
        var counters = {};
        var counterObj = data.aggregations['contenttype.contenttypenavigator_filter'];
        var allCount = counterObj.doc_count;
        var categoryCounter = counterObj['contenttype.contenttypenavigator']['buckets'];

        counters.All = allCount;

        angular.forEach(categoryCounter, function(bucket) {
          counters[bucket.key] = bucket.doc_count;
        });

        $scope.queryCounters = counters;
      }, function(rejection) {
        $log.error(rejection);
      });

      // jscs:enable
      /* jshint ignore:end */
    }

    function getAggs() {
      var defer = searchServiceGet.getAggragates($scope.lastQuery, searchServiceGet.getFilter(), $scope.searchType);

      defer.then(function (data) {
        $scope.aggs = data.aggregations;
      }, function(rejection) {
        $state.go('error', { code: CONFIG.ERROR_CODE.AGGREGATIONS_FAIL, message:rejection });
      });
    }

    function getQuery() {
      return $scope.lastQuery;
    }

    function refreshParams() {
      $state.go('search', $stateParams, { reload: false, notify:false });
    }

    function resetSortOptions() {
      $scope.orderBy = '_score:desc';
      $stateParams.sortType = $scope.orderBy;
    }

    function toggleRefinePanel() {
      $scope.refineDisabled = $scope.searchType === 'ALL' ? true : false;
    }

    function setSortValue(type) {
      switch (type) {
        case 'POSTS':
          $scope.sortText = FIELDS.SORT_RESULTS.POSTS.pubDateNewest.sortText;
          $scope.orderBy = FIELDS.SORT_RESULTS.POSTS.pubDateNewest.val;
          $stateParams.sortType = $scope.orderBy;
          $stateParams.searchType = 'POSTS';
          refreshParams();
          break;
        default:
          break;
      }
    }

    $scope.resetRefines = function() {
      searchServiceGet.resetRefines();
      getAggs();
      getSearchResults();
    };

    $scope.toTitleCase = function(str) {
      return str.toLowerCase().replace(/^[a-z]/, function(str) {
        return str.toUpperCase();
      });
    };

    $scope.sortChanged = function(sort, $event) {
      $scope.orderBy = sort;
      $stateParams.sortType = sort;
      $scope.setOffsetIndex(0); //reset offset
      refreshParams();

      try {
        $event.target.parentElement.parentElement.parentElement.click();
      }
      catch (e) {
        $log.error(e);
      }

      _this.newSearch();
    };

    $scope.orderChanged = function(order) {
      $scope.order = order;
      _this.newSearch();
    };

    $scope.toggleRefineCollapse = function() {
      if ($scope.refineDisabled) {
        return;
      } else if (screenSize.is('xs') === false) {
        //is it at least small?
        if (screenSize.is('sm') === false) {
          return;
        }
      }
      refineCollapsed = !refineCollapsed;
    };

    $scope.setOffsetIndex = function(index) {
      $stateParams.offsetIndex = index;
      refreshParams();
    };

    $scope.setSearchType = function(searchType) {
      $scope.searchType = searchType;
      $stateParams.searchType = searchType;
      refreshParams();
    };

    $scope.isRefineCollapsed = function() {
      refineCollapsed = screenSize.is('xs', 'sm');
      return refineCollapsed;
    };

    $scope.getMore = function () {

      if ($scope.busy === true || offset > $scope.searchResults.length) {
        return false;
      }
      $scope.busy = true;

      if (angular.isDefined(getQuery()) && getQuery() !== '') {

        var waiting = searchServiceGet.get(getQuery(), CONFIG.SEARCH_MAX_PER_PAGE, offset, $scope.orderBy, undefined, $scope.searchType);
        Analytics.trackEvent('searchresult', 'scroll');

        waiting.then(function(data) {
          handleTypeResults(data);
          $scope.busy = false;
          offset += CONFIG.SEARCH_MAX_PER_PAGE;
          $scope.setOffsetIndex(offset);
        }, function(rejection) {
          $state.go('error', {code: CONFIG.ERROR_CODE.SEARCH_FAIL, message: rejection});
        });
      }
    };

    $scope.applyChanges = function(type) {
      $scope.noResults = false;
      $scope.totalResults = 0;
      $scope.busy = true;
      resetSortOptions();
      $scope.setSearchType(type);
      $scope.setOffsetIndex(0);
      searchServiceGet.resetRefines();
      searchServiceGet.setRefines(type);
      setSortValue(type);
      getSearchResults();
      getAggs();
      toggleRefinePanel();
    };

    $scope.$watch('lastQuery', function () {
      $stateParams.query = $scope.lastQuery;
      if (angular.isDefined($scope.lastQuery)) {
        getAggs();
      }
      if (offset > 0) { //"saved search"
        $scope.searchResults = searchServiceGet.getSavedSearchResult();
        if ($scope.searchResults.length > 0) {
          var count = $scope.searchResults[0] && $scope.searchResults[0].total ? $scope.searchResults[0].total : '0';
          count = count.replace(/,/g, '');
          $scope.totalResults = parseInt(count, 10);
          return; //only drop out if we have a result to show...else rerun search
        }

      }
      newSearch();
    });

    function activate() {
      getTypeCounters();
    }

    activate();

  }
})(angular);
