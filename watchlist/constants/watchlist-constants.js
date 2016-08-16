'use strict';

(function (angular) {

  angular
    .module('ne.views.WatchListModule')
    .constant('WATCHLIST_CONFIG', {

      WATCHLIST_CONTAINER_ENDPOINT: '/api/containers/',
      CREATE_WATCHLIST_CONTAINER_ENDPOINT: '/api/containers/createWatchlist',
      DELETE_WATCHLIST_CONTAINER_ENDPOINT: '/api/containers/:containerId',
      READ_WATCHLIST_CONTAINER_BY_USER_ENDPOINT: '/api/containers/ByUser/',
      READ_WATCHLIST_CONTAINER_COUNT_BY_USER_ENDPOINT: '/api/containers/ByUser/count/',
      READ_PUBLIC_WATCHLIST_CONTAINERS_BY_USER_ENDPOINT: '/api/containers/ByUser/:userId/getPublicWatchlists',
      READ_PUBLIC_WATCHLIST_CONTAINER_COUNT_BY_USER_ENDPOINT: '/api/containers/ByUser/:userId/getPublicWatchlistsCount',
      READ_WATCHLIST_CONTAINER_BY_GROUP_ENDPOINT: '/api/containers/ByGroup/:groupId',
      READ_WATCHLIST_CONTAINER_COUNT_BY_GROUP_ENDPOINT: '/api/containers/ByGroup/:groupId',
      UPDATE_WATCHLIST_CONTAINER_ENDPOINT: '/api/containers/:containerId',
      UPDATE_WATCHLIST_CONTAINER_STATUS_ENDPOINT: '/api/containers/:containerId/:containerStatus',
      READ_WATCHLIST_CONTAINER_BY_USER_ITEM_ENDPOINT: '/api/containers/ByUser/items/contains/:itemId',

      WATCHLIST_ITEM_ENDPOINT: '/api/containers/:containerId',
      WATCHLIST_CREATE_ITEM_ENDPOINT: '/api/containers/:containerId/items/:itemId',
      WATCHLIST_IS_ITEM_IN_USER_CONTAINER_ENDPOINT: '/api/containers/ByUser/items/contains/:itemId',
      WATCHLIST_IS_ITEM_BEING_WATCHED_ENDPOINT: '/api/containers/ByUser/items/:itemId/beingWatched',
      WATCHLIST_ARE_ITEMS_BEING_WATCHED_ENDPOINT: '/api/containers/ByUser/items/beingWatched',
      WATCHLIST_REMOVE_ITEMS_FROM_CONTAINER_ENDPOINT: '/api/containers/:containerId/items/:itemId',

      WATCHLIST_NAME_CHARACTER_LIMIT: 50,
      WATCHLIST_DESC_CHARACTER_LIMIT: 500,

      ITEM_ID_SEPARATOR: '::',

      ERROR: {
        NO_RESULT: 'No watch list found for your account',
        GETCONTAINERSBYUSER: 'Got server error while trying to call getContainersByUser.',
        GETPUBLICWATCHLISTSBYUSER: 'Got server error while trying to call getPublicWatchlistsByUser.'
      }

    });

})(angular);