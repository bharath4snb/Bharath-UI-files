'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .service('WatchlistContainerService', WatchlistContainerService);

  WatchlistContainerService.$inject = ['$resource', 'WATCHLIST_CONFIG'];

  function WatchlistContainerService($resource, WATCHLIST_CONFIG) {

    return $resource(WATCHLIST_CONFIG.WATCHLIST_CONTAINER_ENDPOINT, {},
      {

        createWatchlist: {
          method: 'POST',
          url: WATCHLIST_CONFIG.CREATE_WATCHLIST_CONTAINER_ENDPOINT
        },

        delete: {
          method: 'DELETE',
          url: WATCHLIST_CONFIG.DELETE_WATCHLIST_CONTAINER_ENDPOINT,
          params: {
            containerId: '@containerId'
          }
        },

        getContainersByUser: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_BY_USER_ENDPOINT,
          params: {
            containerType: 'watchlist'
          }
        },

        getContainersCountByUser: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_COUNT_BY_USER_ENDPOINT,
          params: {
            containerType: 'watchlist'
          }
        },

        getPublicWatchlistsByUser: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_PUBLIC_WATCHLIST_CONTAINERS_BY_USER_ENDPOINT,
          params: {
            userId: '@userId'
          }
        },

        getPublicWatchlistsCountByUser: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_PUBLIC_WATCHLIST_CONTAINER_COUNT_BY_USER_ENDPOINT,
          params: {
            userId: '@userId'
          }
        },

        getContainersByGroup: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_BY_GROUP_ENDPOINT,
          params: {
            groupId: '@groupId',
            containerType: 'watchlist'
          }
        },

        getContainersCountByGroup: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_BY_GROUP_ENDPOINT,
          params: {
            groupId: '@groupId',
            containerType: 'watchlist'
          }
        },

        update: {
          method: 'PUT',
          url: WATCHLIST_CONFIG.UPDATE_WATCHLIST_CONTAINER_ENDPOINT,
          params: {
            containerId: '@containerId'
          }
        },

        updateContainerStatus: {
          method: 'PUT',
          url: WATCHLIST_CONFIG.UPDATE_WATCHLIST_CONTAINER_STATUS_ENDPOINT,
          params: {
            containerId: '@containerId',
            containerStatus: '@containerStatus'
          }
        },

        getContainersByUserItem: {
          method: 'GET',
          url: WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_BY_USER_ITEM_ENDPOINT,
          isArray: true,
          params: {
            containerType: '@containerType',
            itemId: '@itemId'
          }
        }

      });

  }

})(angular);
