'use strict';

(function (angular) {

  angular
    .module('ne.views.SearchModule')
    .config(SearchConfig);

  SearchConfig.$inject = ['$stateProvider'];

  function SearchConfig($stateProvider) {

    $stateProvider.state('search', {
      url: '/search?query&offsetIndex&sortType&searchType',
      params:{
        query: undefined,
        offsetIndex: '0',
        sortType:undefined,
        filter:undefined,
        searchType: 'ALL'
      },
      controller: 'SearchController',
      templateUrl: 'modules/views/search/templates/search.html',
      label: 'Search',
      authRequired: true
    });
  }

})(angular);
