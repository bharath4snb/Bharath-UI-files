'use strict';

/* globals MockWatchlistItemResponses: true */
describe('Watchlist Item Service', function () {

  var $rootScope;
  var $httpBackend;

  var WatchlistItemService;
  var WATCHLIST_CONFIG;

  beforeEach(module('ne.views.WatchListModule'));

  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _WatchlistItemService_, _WATCHLIST_CONFIG_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    WatchlistItemService = _WatchlistItemService_;
    WATCHLIST_CONFIG = _WATCHLIST_CONFIG_;
  }));

  describe('Service Initialization', function () {

    it('should exist', function () {
      expect(WatchlistItemService).to.not.be.undefined();
    });

    it('should return a $resource class object', function () {
      expect(WatchlistItemService.get).to.not.be.undefined();
      expect(WatchlistItemService.save).to.not.be.undefined();
      expect(WatchlistItemService.query).to.not.be.undefined();
      expect(WatchlistItemService.remove).to.not.be.undefined();
      expect(WatchlistItemService.delete).to.not.be.undefined();
    });

  });

  describe('CREATE: Adding Items to a Watchlist Containers', function () {

    it('should return a 200 status when successfully adding a WOS item to a Watchlist container', function () {

      var mockUrl = WATCHLIST_CONFIG.WATCHLIST_CREATE_ITEM_ENDPOINT.replace(':containerId', 'cont-123-456').replace(':itemId', 'item-123-456');

      $httpBackend.whenPOST(mockUrl + '?itemType=wos', {
          containerId: 'cont-123-456',
          itemId: 'item-123-456',
          itemType: 'wos'
        })
        .respond(200, MockWatchlistItemResponses.AddItemToWatchlist);

      WatchlistItemService.addItemToWatchlist({
          containerId: 'cont-123-456',
          itemId: 'item-123-456',
          itemType: 'wos'
        },
        function (response) {
          expect(response.status).to.equal(200);
        });

      $httpBackend.flush();

    });

    it('should return a 200 status when successfully adding a group of items to a Watchlist container', function () {

      var mockUrl = WATCHLIST_CONFIG.WATCHLIST_CREATE_ITEM_ENDPOINT.replace(':containerId', 'cont-123-456').replace('/:itemId', '');

      $httpBackend.whenPOST(mockUrl, [
          {
            itemId: '45terfgafd-6789-11e5-8bcf-fhghdgh5hdg',
            itemType: 'wos'
          }
        ])
        .respond(200, MockWatchlistItemResponses.AddItemToWatchlist);

      WatchlistItemService.addItemsToWatchlist({
          containerId: 'cont-123-456'
        },
        [
          {
            itemId: '45terfgafd-6789-11e5-8bcf-fhghdgh5hdg',
            itemType: 'wos'
          }
        ],
        function (response) {
          expect(response.status).to.equal(200);
        });

      $httpBackend.flush();

    });

  });

  describe('READ: Retrieve Items from a Watchlist Container', function () {

    it('should return a the contents of a given Watchlist container', function () {

      $httpBackend.whenGET(WATCHLIST_CONFIG.WATCHLIST_ITEM_ENDPOINT.replace(':containerId', 'cont-123-456'))
        .respond(200, MockWatchlistItemResponses.ContainerContents);

      WatchlistItemService.getContainerContents({
          containerId: 'cont-123-456'
        },
        function (response) {
          expect(response.contents.length).to.equal(MockWatchlistItemResponses.ContainerContents.contents.length);
        });

      $httpBackend.flush();

    });

    describe('Utility Methods', function () {

      it('should determine whether an item is within a given container', function () {

        $httpBackend.whenGET(WATCHLIST_CONFIG.WATCHLIST_IS_ITEM_BEING_WATCHED_ENDPOINT.replace(':itemId', 'item-123-456') + '?containerType=watchlist&itemType=wos')
          .respond(200, MockWatchlistItemResponses.ItemInUserContainer);

        WatchlistItemService.isItemInUserContainers({
            itemId: 'item-123-456',
            itemType: 'wos',
            containerType: 'watchlist'
          },
          function (response) {
            expect(response.length).to.equal(MockWatchlistItemResponses.ItemInUserContainer.length);
          });

        $httpBackend.flush();

      });

      it('should determine whether an item is watched by a user', function () {

        $httpBackend.whenPOST(WATCHLIST_CONFIG.WATCHLIST_ARE_ITEMS_BEING_WATCHED_ENDPOINT, [
            {
              itemId: 'item-123-456',
              itemType: 'wos'
            },
            {
              itemId: 'item-456-789',
              itemType: 'wos'
            }
          ])
          .respond(200, MockWatchlistItemResponses.AreItemsBeingWatched);

        WatchlistItemService.areItemsWatchedByUser({}, [
            {
              itemId: 'item-123-456',
              itemType: 'wos'
            },
            {
              itemId: 'item-456-789',
              itemType: 'wos'
            }
          ],
          function (response) {
            expect(response.itemsWatched.length).to.equal(MockWatchlistItemResponses.AreItemsBeingWatched.itemsWatched.length);
          });

        $httpBackend.flush();

      });

    });
  });

  describe('DELETE: Removing Items from a Watchlist Container', function () {

    it('should return a 200 status when removing a specific item from a given container', function () {

      var mockUrl = WATCHLIST_CONFIG.WATCHLIST_REMOVE_ITEMS_FROM_CONTAINER_ENDPOINT.replace(':containerId', 'cont-123-456').replace(':itemId', 'item-123-456');
      $httpBackend.whenDELETE(mockUrl + '?itemType=wos')
        .respond(200, MockWatchlistItemResponses.DeletedItemsFromContainer);

      WatchlistItemService.remove({
          containerId: 'cont-123-456',
          itemId: 'item-123-456',
          itemType: 'wos'
        },
        function (response) {
          expect(response.status).to.equal(MockWatchlistItemResponses.DeletedItemsFromContainer.status);
        });

      $httpBackend.flush();

    });

  });

});