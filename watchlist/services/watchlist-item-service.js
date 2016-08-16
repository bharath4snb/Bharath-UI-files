'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .service('WatchlistItemService', WatchlistItemService);

  WatchlistItemService.$inject = ['$resource', 'WATCHLIST_CONFIG'];

  function WatchlistItemService($resource, WATCHLIST_CONFIG) {

    return $resource(WATCHLIST_CONFIG.WATCHLIST_ITEM_ENDPOINT, {
      containerId: '@containerId'
    }, {

      addItemToWatchlist: {
        method: 'POST',
        url: WATCHLIST_CONFIG.WATCHLIST_CREATE_ITEM_ENDPOINT,
        params: {
          containerId: '@containerId',
          itemId: '@itemId',
          itemType: '@itemType'
        }
      },

      addItemsToWatchlist: {
        method: 'POST',
        url: WATCHLIST_CONFIG.WATCHLIST_CREATE_ITEM_ENDPOINT,
        params: {
          containerId: '@containerId',
          itemType: '@itemType'
        }
      },

      getContainerContents: {
        method: 'GET',
        url: WATCHLIST_CONFIG.WATCHLIST_ITEM_ENDPOINT,
        params: {
          containerId: '@containerId'
        }
      },

      isItemInUserContainers: {
        method: 'GET',
        url: WATCHLIST_CONFIG.WATCHLIST_IS_ITEM_BEING_WATCHED_ENDPOINT,
        params: {
          itemId: '@itemId',
          itemType: '@itemType',
          containerType: '@containerType'
        }
      },

      areItemsWatchedByUser: {
        method: 'POST',
        url: WATCHLIST_CONFIG.WATCHLIST_ARE_ITEMS_BEING_WATCHED_ENDPOINT
      },

      remove: {
        method: 'DELETE',
        url: WATCHLIST_CONFIG.WATCHLIST_REMOVE_ITEMS_FROM_CONTAINER_ENDPOINT,
        params: {
          containerId: '@containerId',
          itemId: '@itemId',
          itemType: '@itemType'
        }
      }

    });

  }

})(angular);