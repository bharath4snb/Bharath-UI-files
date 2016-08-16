'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .service('citationWatchListService', citationWatchListService);

  citationWatchListService.$inject = ['$q', '$resource', '$log', 'Analytics', 'CONFIG'];

  function citationWatchListService($q, $resource, $log, Analytics, CONFIG) {

    var watchlist = null;

    var service = {
      add: add,
      deleteCitation: del,
      isWatching: isWatching,
      getListId: getListId,
      getWatchList: getWatchList
    };

    var citationResource = $resource(CONFIG.CITATION_WATCHLIST_ENDPOINT + '/:itemId', {itemId: '@itemId'},
    {
      add: {
        method: 'PUT'
      },
      isMember: {
        method: 'GET',
        url: CONFIG.CITATION_WATCHLIST_ENDPOINT + '/ismember?id=:itemId',
        param: {itemId: '@itemId'},
        isArray:true
      }
    });

    return service;

    function clearWatchlistCache() {
      watchlist = null;
    }

    function add(itemId, type) {
      var deferred = $q.defer();
      var param = type + '::' + itemId;

      Analytics.trackEvent('watch-srv', param);

      citationResource.add({itemId: param}, function(data) {
        clearWatchlistCache();
        deferred.resolve(data);
      });

      return deferred.promise;
    }

    function getListId() {
      var defer = $q.defer();
      defer.resolve('data');
      return defer.promise;
    }

    function getWatchList() {
      var defer = $q.defer();

      if (!watchlist) {
        citationResource.get(function(data) {
          watchlist = data.items;
          defer.resolve(watchlist);
        });
      } else {
        defer.resolve(watchlist);
      }

      return defer.promise;
    }

    function del(itemId, type) {
      var defer = $q.defer();
      var param = type + '::' + itemId;

      Analytics.trackEvent('unwatch-srv', param);

      citationResource.delete({itemId: param}, function(data) {
        clearWatchlistCache();
        defer.resolve(data);
      });

      return defer.promise;
    }

    function isWatching(itemId, type) {
      var defer = $q.defer();
      var param = type + '::' + itemId;

      citationResource.isMember({itemId: param}, function(data) {
        var response = [];
        if (angular.isDefined(data[0]) && data[0].present)  {
          response = data;
        }
        defer.resolve(response);
      });
      return defer.promise;
    }
  }

})(angular);
