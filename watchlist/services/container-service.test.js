'use strict';

xdescribe('Container Service: ', function () {

  var $httpBackend;
  var containerService;
  var CONFIG;
  var Analytics;
  var mockTRUID;
  var mockCONTAINERID;
  var groupId;
  var mockUPDATEDWLNAME;

  beforeEach(module('ne.views.WatchListModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      CONTAINTER_SERVICE_ENDPOINT: '/api/lists/containers'
    });

    $provide.provider('Analytics', function () {
      this.$get = function () {
        var trackEvent = function (category, action) {
          angular.noop(category, action);
        };

        return {
          trackEvent: trackEvent
        };
      };
    });

    $provide.service('SessionFactory', function () {
      this.userId = 'mockUserId';
    });

  }));

  beforeEach(inject(function (_$httpBackend_, _CONFIG_, _containerService_, _Analytics_) {
    $httpBackend = _$httpBackend_;
    CONFIG = _CONFIG_;
    containerService = _containerService_;
    Analytics = _Analytics_;
    mockTRUID = 'c605e52b56e64cb0a3038aa439fbf9ab';
    mockCONTAINERID = '6780b450-b48b-11e5-868e-0572a4ba0848';
    groupId = '00000000-0000-0000-0000-000000000000';
    mockUPDATEDWLNAME = 'Test Watchlist-updated';
  }));

  it('get containers by user', function () {
    var response = containerService.getContainersByUser();
    expect(response).to.not.be.undefined();
  });

  it('get containers by user count', function () {
    var response = containerService.getContainersCountByUser();
    expect(response).to.not.be.undefined();
  });

  describe('Get containers by group and count', function () {

    it('get containers by group', function () {
      $httpBackend.whenGET(CONFIG.CONTAINTER_SERVICE_ENDPOINT +  '/ByGroup/' + groupId).respond({
        Total: 3,
        Private: 2,
        Public: 1,
        containerWItems: []
      });
      expect(containerService.getContainersByGroup()).to.not.be.undefined();
    });

    it('get containers by group count', function () {
      $httpBackend.whenGET(CONFIG.CONTAINTER_SERVICE_ENDPOINT +  '/ByGroup/' + groupId + '/count').respond({
        count: 3
      });
      expect(containerService.getContainersCountByGroup()).to.not.be.undefined();
    });
  });



});
