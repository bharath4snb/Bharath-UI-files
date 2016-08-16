'use strict';

/* globals MockWatchlistContainerResponses: true */

describe('Watchlist Container Service', function () {

  var $rootScope;
  var $log;
  var $httpBackend;

  var WatchlistContainerService;
  var WATCHLIST_CONFIG;

  beforeEach(module('ne.views.WatchListModule'));

  beforeEach(inject(function (_$rootScope_, _$log_, _$httpBackend_, _WatchlistContainerService_, _WATCHLIST_CONFIG_) {
    $rootScope = _$rootScope_;
    $log = _$log_;
    $httpBackend = _$httpBackend_;

    WatchlistContainerService = _WatchlistContainerService_;
    WATCHLIST_CONFIG = _WATCHLIST_CONFIG_;
  }));

  describe('Service Initialization', function () {

    it('should exist', function () {
      expect(WatchlistContainerService).to.not.be.undefined();
    });

    it('should return a $resource class object', function () {
      expect(WatchlistContainerService.get).to.not.be.undefined();
      expect(WatchlistContainerService.save).to.not.be.undefined();
      expect(WatchlistContainerService.query).to.not.be.undefined();
      expect(WatchlistContainerService.remove).to.not.be.undefined();
      expect(WatchlistContainerService.delete).to.not.be.undefined();
    });

  });

  describe('CREATE: Adding a Watchlist Container', function () {

    it('should return the new PRIVATE container on creation', function () {

      $httpBackend.whenPOST(WATCHLIST_CONFIG.CREATE_WATCHLIST_CONTAINER_ENDPOINT, {
          containerName: 'Mock Container'
        })
        .respond(200, MockWatchlistContainerResponses.PrivateContainerResponse);

      WatchlistContainerService.createWatchlist({},
        {
          containerName: 'Mock Container'
        },
        function (response) {
          expect(response.containerId).to.equal(MockWatchlistContainerResponses.PrivateContainerResponse.containerId);
          expect(response.isPublic).to.be.false();
        });

      $httpBackend.flush();

    });

    it('should return the new PUBLIC container on creation', function () {

      $httpBackend.whenPOST(WATCHLIST_CONFIG.CREATE_WATCHLIST_CONTAINER_ENDPOINT, {
          containerName: 'Mock Container',
          isPublic: true
        })
        .respond(200, MockWatchlistContainerResponses.PublicContainerResponse);

      WatchlistContainerService.createWatchlist({},
        {
          containerName: 'Mock Container',
          isPublic: true
        },
        function (response) {
          expect(response.containerId).to.equal(MockWatchlistContainerResponses.PublicContainerResponse.containerId);
          expect(response.isPublic).to.be.true();
        });

      $httpBackend.flush();

    });

  });

  describe('READ: Retrieving Watchlist Containers', function () {

    describe('Retrieve Containers By User', function () {

      it('should retrieve Watchlist Containers by user', function () {

        $httpBackend.whenGET('/api/containers/ByUser?containerType=watchlist')
          .respond(MockWatchlistContainerResponses.ContainersByUser);

        WatchlistContainerService
          .getContainersByUser({}, function (response) {
            expect(response.Total).to.equal(MockWatchlistContainerResponses.ContainersByUser.Total);
            expect(response.Private).to.equal(MockWatchlistContainerResponses.ContainersByUser.Private);
            expect(response.Public).to.equal(MockWatchlistContainerResponses.ContainersByUser.Public);
          });

        $httpBackend.flush();

      });

      it('should retrieve Watchlist Container Counts by user', function () {

        $httpBackend.whenGET('/api/containers/ByUser/count?containerType=watchlist')
          .respond(MockWatchlistContainerResponses.ContainersCountByUser);

        WatchlistContainerService
          .getContainersCountByUser(function (response) {
            expect(response.count).to.equal(MockWatchlistContainerResponses.ContainersCountByUser.count);
          });

        $httpBackend.flush();

      });

      it('should retrieve PUBLIC Watchlist Containers by user', function () {

        $httpBackend.whenGET(WATCHLIST_CONFIG.READ_PUBLIC_WATCHLIST_CONTAINERS_BY_USER_ENDPOINT.replace(':userId', 'user-123-456'))
          .respond(MockWatchlistContainerResponses.PublicContainersByUser);

        WatchlistContainerService
          .getPublicWatchlistsByUser({userId: 'user-123-456'}, function (response) {
            expect(response.Total).to.equal(MockWatchlistContainerResponses.PublicContainersByUser.Total);
          });

        $httpBackend.flush();

      });

      it('should retrieve PUBLIC Watchlist Container Count by user', function () {

        $httpBackend.whenGET(WATCHLIST_CONFIG.READ_PUBLIC_WATCHLIST_CONTAINER_COUNT_BY_USER_ENDPOINT.replace(':userId', 'user-123-456'))
          .respond(MockWatchlistContainerResponses.PublicContainersCountByUser);

        WatchlistContainerService
          .getPublicWatchlistsCountByUser({userId: 'user-123-456'}, function (response) {
            expect(response.count).to.equal(MockWatchlistContainerResponses.PublicContainersCountByUser.count);
          });

        $httpBackend.flush();

      });

      it('should retrieve Containers by User Item', function () {
        $httpBackend.whenGET(WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_BY_USER_ITEM_ENDPOINT.replace(':itemId', 'item-123-456') + '?containerId=cont-123-456')
          .respond(MockWatchlistContainerResponses.ContainerResponseByUserItem);

        WatchlistContainerService
          .getContainersByUserItem({
            itemId: 'item-123-456',
            containerId: 'cont-123-456'
          }, function (response) {
            expect(response.length).to.equal(MockWatchlistContainerResponses.ContainerResponseByUserItem.length);
          });

        $httpBackend.flush();

      });
    });

    describe('Retrieve Containers By Group', function () {

      it('should retrieve Watchlist Containers by group', function () {

        $httpBackend.whenGET(WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_BY_GROUP_ENDPOINT.replace(':groupId', 'group-123-456') + '?containerType=watchlist')
          .respond(MockWatchlistContainerResponses.ContainersByGroup);

        WatchlistContainerService
          .getContainersByGroup({groupId: 'group-123-456'}, function (response) {
            expect(response.Total).to.equal(MockWatchlistContainerResponses.ContainersByGroup.Total);
          });

        $httpBackend.flush();

      });

      it('should retrieve Watchlist Container Counts by group', function () {

        $httpBackend.whenGET(WATCHLIST_CONFIG.READ_WATCHLIST_CONTAINER_COUNT_BY_GROUP_ENDPOINT.replace(':groupId', 'group-123-456') + '?containerType=watchlist')
          .respond(MockWatchlistContainerResponses.ContainersCountByGroup);

        WatchlistContainerService
          .getContainersByGroup({groupId: 'group-123-456'}, function (response) {
            expect(response.count).to.equal(MockWatchlistContainerResponses.ContainersCountByGroup.count);
          });

        $httpBackend.flush();

      });

    });

  });


  describe('UPDATE: Updating a Watchlist Container', function () {

    describe('Update Watchlist Content', function () {

      it('should update watchlist with provided data', function () {

        $httpBackend.whenPUT(WATCHLIST_CONFIG.UPDATE_WATCHLIST_CONTAINER_ENDPOINT.replace(':containerId', 'cont-123-456'))
          .respond(MockWatchlistContainerResponses.UpdateContainerResponse);

        WatchlistContainerService.update({
            containerId: 'cont-123-456'
          }, {
            containerName: 'Container Name',
            containerDesc: 'Container Description',
            containerImage: 'http://www.containerimage.com/image.jpg',
            groupId: 'groupid-123-456'
          },
          function (response) {
            expect(response.containerId).to.equal('cont-123-456');
          });

        $httpBackend.flush();

      });

    });

    describe('Update Container Status', function () {

      it('should update watchlist status to private', function () {

        $httpBackend.whenPUT(WATCHLIST_CONFIG.UPDATE_WATCHLIST_CONTAINER_STATUS_ENDPOINT.replace(':containerId', 'cont-123-456').replace(':containerStatus', 'makePrivate'))
          .respond(MockWatchlistContainerResponses.PrivateContainerResponse);

        WatchlistContainerService.updateContainerStatus({
            containerId: 'cont-123-456',
            containerStatus: 'makePrivate'
          },
          function (response) {
            expect(response.isPublic).to.be.false();
          });

        $httpBackend.flush();

      });

      it('should update watchlist status to public', function () {

        $httpBackend.whenPUT(WATCHLIST_CONFIG.UPDATE_WATCHLIST_CONTAINER_STATUS_ENDPOINT.replace(':containerId', 'cont-123-456').replace(':containerStatus', 'makePublic'))
          .respond(MockWatchlistContainerResponses.PublicContainerResponse);

        WatchlistContainerService.updateContainerStatus({
            containerId: 'cont-123-456',
            containerName: 'the container name',
            containerStatus: 'makePublic'
          },
          function (response) {
            expect(response.isPublic).to.be.true();
          });

        $httpBackend.flush();

      });

    });

  });

  describe('DELETE: Deleting a Watchlist Container', function () {

    describe('Delete Watchlist', function () {

      it('should delete watchlist with provided id', function () {

        $httpBackend.whenDELETE(WATCHLIST_CONFIG.DELETE_WATCHLIST_CONTAINER_ENDPOINT.replace(':containerId', 'cont-123-456'))
          .respond(MockWatchlistContainerResponses.DeleteContainerResponse);

        WatchlistContainerService.delete({
            containerId: 'cont-123-456'
          },
          function (response) {
            expect(response.containerId).to.equal('cont-123-456');
          });

        $httpBackend.flush();

      });

    });

  });

});